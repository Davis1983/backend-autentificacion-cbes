import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { LoginAuthDto } from '../core/domains/dtos/login-auth.dto';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { AutUsuarioService } from '../../autorizacion/services/impl/aut-usuario.service';
import { QueryBuilder } from 'typeorm';
import { AutUsuario } from 'src/modules/autorizacion/core/domains/entities/aut-usuario.entity';
import { Repository } from 'typeorm';
import { RespuestaM } from 'src/core/domain/models/respuesta.model';
import { RespuestaService } from 'src/modules/shared/services/respuesta.service';
import * as nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { CambiarContraseniaDto } from '../core/domains/dtos/cambiar-contrasenia.dto';
import * as crypto from 'crypto';
import { UpdateCambiarContraseniaDto } from '../core/domains/dtos/cambiar-contrasenia.dto';
import { Console, error, info } from 'console';
import { rejects } from 'assert';
import { resolve } from 'path';
import { Client } from 'pg';
import { AutUsuarioRepository } from '../repositories/aut-usuario.repository';
import { transformaCamelCaseArrayObjeto } from 'src/common/utility/all.utill';

@Injectable()
export class AuthService {
  _autUsuarioRepository: AutUsuarioRepository;
  _main = 'AuthService';
  constructor(
    @Inject('PG') private _client: Client,
    @InjectRepository(AutUsuario)
    private _autUsuario: Repository<AutUsuario>,
    private utilService: AutUsuarioService,
    private _respuestaService: RespuestaService,
  ) {
    this._autUsuarioRepository = new AutUsuarioRepository(_client);
  }

  //TODO:estoy agregando idSistema para que se pueda loguear en el sistema de rues
  async login(
    usuario: string,
    contrasenia: string,
    idSistema: number,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ login';
    try {
      const user: AutUsuario = await this._autUsuario
        .createQueryBuilder('usuario')
        .where({ usuario })
        .andWhere("usuario.idcEstado='ESTADO_USUARIO_HABILITADO'")
        .innerJoinAndSelect('usuario.autPersona', 'aut_persona')
        .select([
          'usuario.idPersona',
          'usuario.usuario',
          'aut_persona.nombres',
          'aut_persona.primerApellido',
          'aut_persona.segundoApellido',
          'aut_persona.numeroDocumento',
          'aut_persona.complemento',
          'usuario.contrasenia',
          'usuario.idcTipoUsuario',
          'usuario.correoElectronico',
          'usuario.idcEstado',
          'usuario.contraseniaReset',
        ])
        .getOne();
      if (!user) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Usuario y/o contraseña invalidos',
        );
      } else {
        if (this.comparePassword(contrasenia, user.contrasenia)) {
          delete user['contrasenia'];
          let data = null;
          if (user['contraseniaReset'] == false) {
            const restricciones =
              await this._autUsuarioRepository.listarRestriccionesByUsuarioByIdSistema(
                usuario,
                idSistema,
              );

            if (!restricciones || restricciones.length == 0) {
              return this._respuestaService.respuestaHttp(
                false,
                null,
                ruta,
                'El usuario no esta habilitado para el sistema seleccionado',
              );
            }
            data = {
              usuario: user['usuario'],
              token: this.getToken(user),
              contraseniaReset: user['contraseniaReset'],
              restricciones: transformaCamelCaseArrayObjeto(restricciones),
            };
            return this._respuestaService.respuestaHttp(
              true,
              data,
              ruta,
              'Inicio de Sesion correcto',
            );
          } else {
            data = {
              usuario: user['usuario'],
              token: this.getToken(user),
              contraseniaReset: user['contraseniaReset'],
            };
            return this._respuestaService.respuestaHttp(
              true,
              data,
              ruta,
              'Restaurar contraseña por primera sesion',
            );
          }
        } else {
          return this._respuestaService.respuestaHttp(
            false,
            null,
            ruta,
            'Usuario y/o contraseña invalidos',
          );
        }
      }
    } catch (error) {
      //console.error(error);
      // Aquí puedes manejar la excepción, por ejemplo, retornando una respuesta de error
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error comuniquese con soporte ${error}`,
      );
    }
  }

  getToken(user: AutUsuario) {
    let privateKey = fs.readFileSync(`${process.env['PRIVATE_KEY']}`);
    let token = jwt.sign(
      {
        exp:
          Math.floor(Date.now() / 1000) + Number(process.env['TOKEN_EXP']) * 60,
        data: user,
        iat: Math.floor(Date.now() / 1000),
      },
      privateKey,
      { algorithm: 'RS256' },
    );
    return token;
  }

  verify(token: string) {
    return new Observable((subscriber) => {
      var cert = fs.readFileSync(`${process.env['PUBLIC_KEY']}`);
      jwt.verify(token, cert, (err, decoded) => {
        if (err != undefined) {
          let respuesta = {
            verify: 'Token no valido y/o Jwt Expirado',
            error: err.message,
          };
          //throw new UnauthorizedException(respuesta);
          subscriber.next(respuesta);
          subscriber.complete();
        }
        if (decoded != undefined) {
          subscriber.next({ verify: 'valid' });
          subscriber.complete();
        }
      });
    });
  }

  decode(token: string) {
    return new Observable((subscriber) => {
      var cert = fs.readFileSync(`${process.env['PUBLIC_KEY']}`);
      jwt.verify(token, cert, (err, decoded) => {
        if (err != undefined) {
          throw new UnauthorizedException(err);
        }
        if (decoded != undefined) {
          subscriber.next(decoded);
          subscriber.complete();
        }
      });
    });
  }

  sendmail(to: string, subject: string, text: string, html: string) {
    const message = {
      from: process.env.MAIL_FROM,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    /*const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true, // use TLS
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: true,
      },
    });*/
    /*const transporter = nodemailer.createTransport({
      pool: true,
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true, // use TLS
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });*/
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    transporter.sendMail(message, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  }

  verifyTokenForGuard(token: string) {
    return new Observable((subscriber) => {
      var cert = fs.readFileSync(`${process.env['PUBLIC_KEY']}`);
      jwt.verify(token, cert, (err, decoded) => {
        if (err != undefined) {
          //subscriber.next(false);
          //subscriber.complete();
          subscriber.error(err);
          subscriber.complete();
        }
        if (decoded != undefined) {
          subscriber.next(decoded);
          subscriber.complete();
        }
      });
    });
  }

  async mailRestablecerContrasenia(usuario: string): Promise<RespuestaM> {
    let datosUsuario = null;
    let html = null;
    datosUsuario = await this._autUsuario.findOne({
      select: {
        idPersona: true,
        usuario: true,
        correoElectronico: true,
      },
      where: {
        usuario: usuario,
        bajaLogicaRegistro: false,
      },
    });
    if (datosUsuario) {
      /*Si existe el usuario en la base de datos se procede
      a enviar el correo para la recuperacion del password*/
      const token = this.getToken(datosUsuario);
      const linkContrasenia =
        process.env.URL_RUES_APP +
        '/restorepassword?usuario=' +
        datosUsuario.usuario +
        '&token=' +
        token;
      html =
        '<table style="box-sizing:border-box; text-align: center;" width="100%" cellspacing="0" cellpadding="0">' +
        '<tr><td><table style="box-sizing:border-box; text-align: center; margin-left: auto; margin-right: auto' +
        'text-align: left;" width="60%" cellspacing="0" cellpadding="0">' +
        '<tbody style="box-sizing:border-box">' +
        '<tr style="box-sizing:border-box">' +
        '<td style="box-sizing:border-box;font-weight:400;text-align:left;padding-bottom:5px;padding-left:35px;padding-right:35px;padding-top:30px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"' +
        'width="100%" valign="top" align="left">' +
        '<div style="text-align:center"><img alt="logo"' +
        'src="https://rues.minsalud.gob.bo/img/Logo_MS.jpg" width="320">' +
        '</div>' +
        '<table role="presentation" style="box-sizing:border-box" width="100%" cellspacing="0" cellpadding="0" border="0">' +
        '<tbody>' +
        '<tr style="box-sizing:border-box"' +
        '<td style="box-sizing:border-box;padding-top:10px;text-align:center;width:100%" width="100%" align="center">' +
        '<h1 style="box-sizing:border-box;margin:0;color:#13161c;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:22px;font-weight:700;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0">' +
        '<span style="box-sizing:border-box">Estimada(o) ' +
        datosUsuario.usuario +
        ', de acuerdo a lo solicitado usted podra realizar la modificación de su password:</span>' +
        '</h1>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '<table role="presentation" style="box-sizing:border-box" width="100%" cellspacing="0" cellpadding="10" border="0">' +
        '<tbody>' +
        '<tr style="box-sizing:border-box">' +
        '<td style="box-sizing:border-box">' +
        '<div style="box-sizing:border-box" align="center">' +
        '<table role="presentation" style="box-sizing:border-box" width="60%" cellspacing="0" cellpadding="0" border="0">' +
        '<tbody>' +
        '<tr style="box-sizing:border-box">' +
        '<td style="box-sizing:border-box;font-size:1px;line-height:1px;border-top:2px solid #0ae98a">' +
        '<span style="box-sizing:border-box"> </span>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</td>' +
        '</tr>' +
        '<tr style="box-sizing:border-box">' +
        '<td style="box-sizing:border-box">' +
        '<div style="box-sizing:border-box;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;text-align:center" align="center">' +
        '<div style="box-sizing:border-box;background-color:#13161c;border-radius:15px;padding:20px;margin:20px">' +
        '<h2 style="box-sizing:border-box;text-align:left;color:#fff">Para tal efecto debe considerar lo siguiente:</h2>' +
        '<p style="box-sizing:border-box;line-height:inherit;font-size:16px;text-align:left;margin-bottom:10px;color:#fff">' +
        '(*) 6 carácteres como mínimo</p>' +
        '<p style="box-sizing:border-box;line-height:inherit;font-size:16px;text-align:left;margin-bottom:10px;color:#fff">' +
        '(*) Al menos un caracter especial (@, $, *, #, etc.)</p>' +
        '<p style="box-sizing:border-box;line-height:inherit;font-size:16px;text-align:left;margin-bottom:10px;color:#fff">' +
        '(*) Al menos una letra</p>' +
        '<p style="box-sizing:border-box;line-height:inherit;font-size:16px;text-align:left;margin-bottom:10px;color:#fff">' +
        '(*) Al menos un número</p>' +
        '<div style="box-sizing:border-box;text-align:right"> <a href="' +
        linkContrasenia +
        '" style="box-sizing:border-box;background-color:#13161c;border:none;color:#0bf491;padding:10px 20px;text-align:center;text-decoration:none;display:inline-block;font-size:16px;border-radius:5px;font-weight:bold" target="_blank">Enlace para el cambio de password ↗</a> </div>' +
        '</div>' +
        '</div>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</td>' +
        '</tr>' +
        '</table>';
      const message = {
        from: process.env.MAIL_FROM,
        to: datosUsuario.correoElectronico,
        subject: 'RUES - Restablecer Password ',
        text: 'Restablecer Password',
        html: html,
      };
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      let respuesta = null;
      return new Promise((resolve, rejects) => {
        transporter.sendMail(message, (error, info) => {
          if (error) {
            respuesta = this._respuestaService.respuestaHttp(
              false,
              error,
              null,
              'Error en el envio de correo electrónico',
            );
            resolve(respuesta);
            console.log(error);
          } else {
            respuesta = this._respuestaService.respuestaHttp(
              true,
              info,
              null,
              'Correo enviado correctamente...',
            );
            resolve(respuesta);
            console.log('The message was sent!');
          }
        });
      });
    } else {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        null,
        'Usuario inexistente',
      );
    }
  }

  async restaurarContrasenia(
    username: string,
    changes: UpdateCambiarContraseniaDto,
  ): Promise<RespuestaM> {
    console.log(username, changes.token);
    const tokenValido = await this.verify(changes.token).toPromise();
    const user: AutUsuario = await this._autUsuario
      .createQueryBuilder('usuario')
      .where("usuario.usuario='" + username + "'")
      .select([
        'usuario.idPersona',
        'usuario.usuario',
        'usuario.contrasenia',
        'usuario.contraseniaReset',
      ])
      .getOne();
    console.log(tokenValido);
    if (tokenValido['verify'] == 'valid') {
      if (changes.contraseniaNueva == changes.confirmaContrasenia) {
        const usuario = await this._autUsuario.findOneBy({
          usuario: username,
        });
        const passwordEncode = this.getPassword(changes.contraseniaNueva);
        changes.contrasenia = String(passwordEncode);
        this._autUsuario.merge(usuario, changes);
        this._autUsuario.save(usuario);
        delete user['contrasenia'];
        return this._respuestaService.respuestaHttp(
          true,
          user,
          null,
          'Contraseña restaurada correctamente',
        );
      } else {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          null,
          'La confirmacion de contraseña no coincide con el password nuevo',
        );
      }
    } else {
      return this._respuestaService.respuestaHttp(
        false,
        tokenValido['error'],
        null,
        'Token Expirado',
      );
    }
  }

  async update(username: string, changes: UpdateCambiarContraseniaDto) {
    const nuevaContrasenia = this.getPassword(changes.contrasenia);
    //console.log(nuevaContrasenia);
    const usuario = await this._autUsuario.findOneBy({
      usuario: username,
    });
    changes.contrasenia = String(nuevaContrasenia);
    this._autUsuario.merge(usuario, changes);
    return this._autUsuario.save(usuario);
  }

  async defaultPassword(username: string): Promise<RespuestaM> {
    const user: AutUsuario = await this._autUsuario
      .createQueryBuilder('usuario')
      .where("usuario.usuario='" + username + "'")
      .andWhere("usuario.idcEstado='ESTADO_USUARIO_HABILITADO'")
      .innerJoinAndSelect('usuario.autPersona', 'aut_persona')
      .select([
        'usuario.idPersona',
        'usuario.usuario',
        'aut_persona.nombres',
        'aut_persona.primerApellido',
        'aut_persona.segundoApellido',
        'aut_persona.numeroDocumento',
        'aut_persona.complemento',
        'usuario.contrasenia',
        'usuario.idcTipoUsuario',
        'usuario.correoElectronico',
        'usuario.idcEstado',
        'usuario.contraseniaReset',
      ])
      .getOne();
    //console.log(user.autPersona['numeroDocumento']);
    if (user) {
      const nuevaContrasenia = this.getPassword(
        user.autPersona['numeroDocumento'],
      );
      console.log(user.autPersona['numeroDocumento']);
      const usuario = await this._autUsuario.findOneBy({
        usuario: username,
      });
      usuario.contrasenia = String(nuevaContrasenia);
      usuario.contraseniaReset = true;
      this._autUsuario.merge(usuario);
      this._autUsuario.save(usuario);
      //Eliminar el password para que no muestre el dato
      delete user['contrasenia'];
      return this._respuestaService.respuestaHttp(
        true,
        user,
        null,
        'Contraseña restaurada a su valor por defecto',
      );
    } else {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        null,
        'Error no se encuentra los datos del usuario seleccionado',
      );
    }
  }

  async resetContrasenia(
    username: string,
    changes: UpdateCambiarContraseniaDto,
  ): Promise<RespuestaM> {
    const user: AutUsuario = await this._autUsuario
      .createQueryBuilder('usuario')
      .where("usuario.usuario='" + username + "'")
      .select([
        'usuario.idPersona',
        'usuario.usuario',
        'usuario.contrasenia',
        'usuario.contraseniaReset',
      ])
      .getOne();
    if (user) {
      if (this.comparePassword(changes.contraseniaActual, user.contrasenia)) {
        if (changes.contraseniaNueva == changes.confirmaContrasenia) {
          const usuario = await this._autUsuario.findOneBy({
            usuario: username,
          });
          const passworEncode = this.getPassword(changes.contraseniaNueva);
          changes.contrasenia = String(passworEncode);
          changes.contraseniaReset = false;
          this._autUsuario.merge(usuario, changes);
          this._autUsuario.save(usuario);
          delete user['contrasenia'];
          return this._respuestaService.respuestaHttp(
            true,
            user,
            null,
            'Contraseña modificada correctamente',
          );
        } else {
          return this._respuestaService.respuestaHttp(
            false,
            null,
            null,
            'La confirmacion de contraseña no coincide con el password nuevo',
          );
        }
      } else {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          null,
          'La contraseña registrada no coincide con la actual',
        );
      }
    } else {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        null,
        'El username no existe en la base de datos',
      );
    }
  }

  getPassword(password: string): string {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 2048, 32, 'sha512')
      .toString('hex');
    return [salt, hash].join('$');
  }

  comparePassword(password: string, password2: string) {
    const originalHash = password2.split('$')[1];
    const salt = password2.split('$')[0];
    const hash = crypto
      .pbkdf2Sync(password, salt, 2048, 32, 'sha512')
      .toString('hex');
    return hash === originalHash;
  }

  async mailCreateUser(
    usuario: string,
    idcNivel: string,
    carnet: string,
  ): Promise<RespuestaM> {
    let datosUsuario = null;
    let html = null;
    datosUsuario = await this._autUsuario.findOne({
      select: {
        idPersona: true,
        usuario: true,
        correoElectronico: true,
      },
      where: {
        usuario: usuario,
        bajaLogicaRegistro: false,
      },
    });
    if (datosUsuario) {
      /*Si existe el usuario en la base de datos se procede
      a enviar el correo para la recuperacion del password*/
      const linkSistema = process.env.URL_RUES_APP + '/login';
      html =
        '<table style="box-sizing:border-box; text-align: center;" width="100%" cellspacing="0" cellpadding="0">' +
        '<tr><td><table style="box-sizing:border-box; text-align: center; margin-left: auto; margin-right: auto' +
        'text-align: left;" width="60%" cellspacing="0" cellpadding="0">' +
        '<tbody style="box-sizing:border-box">' +
        '<tr style="box-sizing:border-box">' +
        '<td style="box-sizing:border-box;font-weight:400;text-align:left;padding-bottom:5px;padding-left:35px;padding-right:35px;padding-top:30px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"' +
        'width="100%" valign="top" align="left">' +
        '<div style="text-align:center"><img alt="logo"' +
        'src="https://rues.minsalud.gob.bo/img/Logo_MS.jpg" width="320">' +
        '</div>' +
        '<table role="presentation" style="box-sizing:border-box" width="100%" cellspacing="0" cellpadding="0" border="0">' +
        '<tbody>' +
        '<tr style="box-sizing:border-box"' +
        '<td style="box-sizing:border-box;padding-top:10px;text-align:center;width:100%" width="100%" align="center">' +
        '<h1 style="box-sizing:border-box;margin:0;color:#13161c;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:22px;font-weight:700;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0">' +
        '<span style="box-sizing:border-box">Estimada(o) ' +
        datosUsuario.usuario +
        ', fue habilitado su ingreso exitosamente para el Sistema de Seguimiento a Establecimientos de Salud - RUES:</span>' +
        '</h1>' +
        '<h1 style="box-sizing:border-box;margin:0;color:#13161c;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:22px;font-weight:700;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0">' +
        '<span style="box-sizing:border-box">Datos para el ingreso al Sistema:</span></h1>' +
        '<h1 style="box-sizing:border-box;margin:0;color:#13161c;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:22px;font-weight:700;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0">' +
        '<span style="box-sizing:border-box">Nivel: ' +
        idcNivel +
        '</span></h1>' +
        '<h1 style="box-sizing:border-box;margin:0;color:#13161c;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:22px;font-weight:700;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0">' +
        '<span style="box-sizing:border-box">Usuario: ' +
        usuario +
        '</span></h1>' +
        '<h1 style="box-sizing:border-box;margin:0;color:#13161c;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:22px;font-weight:700;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0">' +
        '<span style="box-sizing:border-box">Contraseña (CI): ' +
        carnet +
        '</span></h1>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '<table role="presentation" style="box-sizing:border-box" width="100%" cellspacing="0" cellpadding="10" border="0">' +
        '<tbody>' +
        '<tr style="box-sizing:border-box">' +
        '<td style="box-sizing:border-box">' +
        '<div style="box-sizing:border-box" align="center">' +
        '<table role="presentation" style="box-sizing:border-box" width="60%" cellspacing="0" cellpadding="0" border="0">' +
        '<tbody>' +
        '<tr style="box-sizing:border-box">' +
        '<td style="box-sizing:border-box;font-size:1px;line-height:1px;border-top:2px solid #0ae98a">' +
        '<span style="box-sizing:border-box"> </span>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</td>' +
        '</tr>' +
        '<tr style="box-sizing:border-box">' +
        '<td style="box-sizing:border-box">' +
        '<div style="box-sizing:border-box;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;text-align:center" align="center">' +
        '<div style="box-sizing:border-box;background-color:#13161c;border-radius:15px;padding:20px;margin:20px">' +
        '<h2 style="box-sizing:border-box;text-align:left;color:#fff">Para tal efecto debe considerar lo siguiente:</h2>' +
        '<p style="box-sizing:border-box;line-height:inherit;font-size:16px;text-align:left;margin-bottom:10px;color:#fff">' +
        '(*) 6 carácteres como mínimo</p>' +
        '<p style="box-sizing:border-box;line-height:inherit;font-size:16px;text-align:left;margin-bottom:10px;color:#fff">' +
        '(*) Al menos un caracter especial (@, $, *, #, etc.)</p>' +
        '<p style="box-sizing:border-box;line-height:inherit;font-size:16px;text-align:left;margin-bottom:10px;color:#fff">' +
        '(*) Al menos una letra</p>' +
        '<p style="box-sizing:border-box;line-height:inherit;font-size:16px;text-align:left;margin-bottom:10px;color:#fff">' +
        '(*) Al menos un número</p>' +
        '<div style="box-sizing:border-box;text-align:right"> <a href="' +
        linkSistema +
        '" style="box-sizing:border-box;background-color:#13161c;border:none;color:#0bf491;padding:10px 20px;text-align:center;text-decoration:none;display:inline-block;font-size:16px;border-radius:5px;font-weight:bold" target="_blank">Enlace para el ingreso al GABO ↗</a> </div>' +
        '</div>' +
        '</div>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</td>' +
        '</tr>' +
        '</table>';
      const message = {
        from: process.env.MAIL_FROM,
        to: datosUsuario.correoElectronico,
        subject: 'GABO - Creación de Usuario ',
        text: 'Ingreso al Sistema de Gestión y Administración Boliviana de Operadores - GABO',
        html: html,
      };
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      let respuesta = null;
      return new Promise((resolve, rejects) => {
        transporter.sendMail(message, (error, info) => {
          if (error) {
            respuesta = this._respuestaService.respuestaHttp(
              false,
              error,
              null,
              'Error en el envio de correo electrónico',
            );
            resolve(respuesta);
          } else {
            respuesta = this._respuestaService.respuestaHttp(
              true,
              info,
              null,
              'Correo enviado correctamente...',
            );
            resolve(respuesta);
            console.log('The message was sent!');
          }
        });
      });
    } else {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        null,
        'Usuario inexistente',
      );
    }
  }

  /**Envio de correo para restablecer password desde el RUES */

  async mailRestablecerContraseniaRues(usuario: string): Promise<RespuestaM> {
    let datosUsuario = null;
    let html = null;
    datosUsuario = await this._autUsuario.findOne({
      select: {
        idPersona: true,
        usuario: true,
        correoElectronico: true,
      },
      where: {
        usuario: usuario,
        bajaLogicaRegistro: false,
      },
    });
    if (datosUsuario) {
      /*Si existe el usuario en la base de datos se procede
      a enviar el correo para la recuperacion del password*/
      const token = this.getToken(datosUsuario);
      const linkContrasenia =
        process.env.URL_MAIL_RUES +
        '/reset-password?usuario=' +
        datosUsuario.usuario +
        '&token=' +
        token;
      html =
        '<table style="box-sizing:border-box; text-align: center;" width="100%" cellspacing="0" cellpadding="0">' +
        '<tr><td><table style="box-sizing:border-box; text-align: center; margin-left: auto; margin-right: auto' +
        'text-align: left;" width="60%" cellspacing="0" cellpadding="0">' +
        '<tbody style="box-sizing:border-box">' +
        '<tr style="box-sizing:border-box">' +
        '<td style="box-sizing:border-box;font-weight:400;text-align:left;padding-bottom:5px;padding-left:35px;padding-right:35px;padding-top:30px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"' +
        'width="100%" valign="top" align="left">' +
        '<div style="text-align:center"><img alt="logo"' +
        'src="https://rues.minsalud.gob.bo/img/Logo_MS.jpg" width="320">' +
        '</div>' +
        '<table role="presentation" style="box-sizing:border-box" width="100%" cellspacing="0" cellpadding="0" border="0">' +
        '<tbody>' +
        '<tr style="box-sizing:border-box"' +
        '<td style="box-sizing:border-box;padding-top:10px;text-align:center;width:100%" width="100%" align="center">' +
        '<h1 style="box-sizing:border-box;margin:0;color:#13161c;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:22px;font-weight:700;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0">' +
        '<span style="box-sizing:border-box">Estimada(o) ' +
        datosUsuario.usuario +
        ', de acuerdo a lo solicitado usted podra realizar la modificación de su password:</span>' +
        '</h1>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '<table role="presentation" style="box-sizing:border-box" width="100%" cellspacing="0" cellpadding="10" border="0">' +
        '<tbody>' +
        '<tr style="box-sizing:border-box">' +
        '<td style="box-sizing:border-box">' +
        '<div style="box-sizing:border-box" align="center">' +
        '<table role="presentation" style="box-sizing:border-box" width="60%" cellspacing="0" cellpadding="0" border="0">' +
        '<tbody>' +
        '<tr style="box-sizing:border-box">' +
        '<td style="box-sizing:border-box;font-size:1px;line-height:1px;border-top:2px solid #0ae98a">' +
        '<span style="box-sizing:border-box"> </span>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</td>' +
        '</tr>' +
        '<tr style="box-sizing:border-box">' +
        '<td style="box-sizing:border-box">' +
        '<div style="box-sizing:border-box;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;text-align:center" align="center">' +
        '<div style="box-sizing:border-box;background-color:#13161c;border-radius:15px;padding:20px;margin:20px">' +
        '<h2 style="box-sizing:border-box;text-align:left;color:#fff">Para tal efecto debe considerar lo siguiente:</h2>' +
        '<p style="box-sizing:border-box;line-height:inherit;font-size:16px;text-align:left;margin-bottom:10px;color:#fff">' +
        '(*) 6 carácteres como mínimo</p>' +
        '<p style="box-sizing:border-box;line-height:inherit;font-size:16px;text-align:left;margin-bottom:10px;color:#fff">' +
        '(*) Al menos un caracter especial (@, $, *, #, etc.)</p>' +
        '<p style="box-sizing:border-box;line-height:inherit;font-size:16px;text-align:left;margin-bottom:10px;color:#fff">' +
        '(*) Al menos una letra</p>' +
        '<p style="box-sizing:border-box;line-height:inherit;font-size:16px;text-align:left;margin-bottom:10px;color:#fff">' +
        '(*) Al menos un número</p>' +
        '<div style="box-sizing:border-box;text-align:right"> <a href="' +
        linkContrasenia +
        '" style="box-sizing:border-box;background-color:#13161c;border:none;color:#0bf491;padding:10px 20px;text-align:center;text-decoration:none;display:inline-block;font-size:16px;border-radius:5px;font-weight:bold" target="_blank">Enlace para el cambio de password ↗</a> </div>' +
        '</div>' +
        '</div>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</td>' +
        '</tr>' +
        '</table>';
      const message = {
        from: process.env.MAIL_FROM,
        to: datosUsuario.correoElectronico,
        subject: 'RUES - Restablecer Password ',
        text: 'Restablecer Password',
        html: html,
      };
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      let respuesta = null;
      return new Promise((resolve, rejects) => {
        transporter.sendMail(message, (error, info) => {
          if (error) {
            respuesta = this._respuestaService.respuestaHttp(
              false,
              error,
              null,
              'Error en el envio de correo electrónico',
            );
            resolve(respuesta);
            console.log(error);
          } else {
            respuesta = this._respuestaService.respuestaHttp(
              true,
              info,
              null,
              'Correo enviado correctamente...',
            );
            resolve(respuesta);
            console.log('The message was sent!');
          }
        });
      });
    } else {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        null,
        'Usuario inexistente',
      );
    }
  }
}
