import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AutUsuarioServiceInterface } from '../aut-usuario.interface';
import { Repository } from 'typeorm';
import { Client } from 'pg';
import { AutUsuario } from '../../core/domains/entities/aut-usuario.entity';
import { RespuestaM } from 'src/core/domain/models/respuesta.model';
import { RespuestaService } from 'src/modules/shared/services/respuesta.service';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { PaginationDto } from '../../../../core/domain/dtos/pagination.dto';
import { AutUsuarioRestriccionFilterDto } from 'src/core/domain/dtos/aut-usuario-restriccion-filter.dto';
import { ContextoDto } from '../../core/domains/dtos';
import {
  formatoFecha,
  transformaCamelCaseArrayObjeto,
} from '../../../../common/utility/all.utill';
import {
  CreateAutUsuarioDto,
  UpdateAutUsuarioDto,
} from '../../core/domains/dtos';
import { AutPersonaService } from './aut-persona.service';
import { AutPersonaUsuarioRespository } from '../../repositories/impl/aut-persona-usuario.repository';

import { AutUsuarioRepository } from '../../repositories/impl/aut-usuario.repository';
import { AutPerfilService } from './aut-perfil.service';
import { AutUsuarioPerfilRecursoMapper_EntitiesToDtos } from '../../mapper/aut-usuario-perfil-recurso.mapper';
import { error } from 'console';
import * as ExcelJS from 'exceljs';

import { Res } from '@nestjs/common';
import { Response } from 'express';
import { PassThrough } from 'stream';

export class AutUsuarioService implements AutUsuarioServiceInterface {
  _main = 'AutUsuarioService';
  _autPersonaUsuarioRepository: AutPersonaUsuarioRespository;
  autUsuarioRepository: AutUsuarioRepository;
  constructor(
    @Inject('PG') private _client: Client,
    @InjectRepository(AutUsuario)
    private _autUsuario: Repository<AutUsuario>,
    private _respuestaService: RespuestaService, //private _personaService: AutPersonaService,
  ) {
    this._autPersonaUsuarioRepository = new AutPersonaUsuarioRespository(
      _client,
    );
    this.autUsuarioRepository = new AutUsuarioRepository(_client);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<AutUsuario>> {
    return paginate<AutUsuario>(this._autUsuario, options);
    const queryBuilder = this._autUsuario.createQueryBuilder('c');
    queryBuilder.orderBy('c.idPersona', 'ASC'); //
    return paginate<AutUsuario>(queryBuilder, options);
  }

  async findAllAutUsuario(
    autUsuarioRestriccionFilterDto: AutUsuarioRestriccionFilterDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ findAllAutUsuario';
    const limit = 10;
    const offset = 0;
    let data = null;
    try {
      // data = await this._autUsuario
      // .createQueryBuilder('usuario')
      // .where("usuario.idcEstado='ESTADO_USUARIO_HABILITADO'")
      // .innerJoinAndSelect('usuario.autPersona','aut_persona')
      // .select(['usuario.idPersona',
      // 'usuario.usuario',
      // 'aut_persona.nombres',
      // 'aut_persona.primerApellido',
      // 'aut_persona.segundoApellido',
      // 'aut_persona.numeroDocumento',
      // 'aut_persona.complemento',
      // 'usuario.idcTipoUsuario',
      // 'usuario.correoElectronico',
      // 'usuario.idcEstado'])
      // .orderBy('usuario.idPersona', 'DESC')
      // .take(limit)
      // .skip(offset)
      // .getMany();
      data = await this._autPersonaUsuarioRepository.listaPersonaUsuarioFilter(
        autUsuarioRestriccionFilterDto.idSistema,
        autUsuarioRestriccionFilterDto.idInstitucion,
        autUsuarioRestriccionFilterDto.idcNivel,
        autUsuarioRestriccionFilterDto.idSubsector,
        autUsuarioRestriccionFilterDto.codDepartamento,
        autUsuarioRestriccionFilterDto.codMunicipio,
        autUsuarioRestriccionFilterDto.codArea,
        autUsuarioRestriccionFilterDto.codEstablecimiento,
        autUsuarioRestriccionFilterDto.usuario,
      );
      if (data) {
        //   data.map((datos) => {
        //   datos.fechaRegistro = datos.fechaRegistro;
        // });
        return this._respuestaService.respuestaHttp(
          true,
          data,
          ruta,
          'correcto',
        );
      } else {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'No se encontraron registros',
        );
      }
    } catch (e) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${e.message}`,
      );
    }
  }

  async listarExcel(
    autUsuarioRestriccionFilterDto: AutUsuarioRestriccionFilterDto,
  ): Promise<RespuestaM> {
    //console.log('llego a listar excel');
    const ruta = this._main + '/ findAllAutUsuario';
    const limit = 10;
    const offset = 0;
    let data = null;
    try {
      data = await this._autPersonaUsuarioRepository.listaPersonaUsuarioFilter(
        autUsuarioRestriccionFilterDto.idSistema,
        autUsuarioRestriccionFilterDto.idInstitucion,
        autUsuarioRestriccionFilterDto.idcNivel,
        autUsuarioRestriccionFilterDto.idSubsector,
        autUsuarioRestriccionFilterDto.codDepartamento,
        autUsuarioRestriccionFilterDto.codMunicipio,
        autUsuarioRestriccionFilterDto.codArea,
        autUsuarioRestriccionFilterDto.codEstablecimiento,
        autUsuarioRestriccionFilterDto.usuario,
      );
        console.log(data);
      if (data == null){
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'No se encontraron registros',
        );
      }
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Usuarios');

      // 1. Crear el título "Reporte de Usuarios" en la fila 1 entre las columnas D e I
      worksheet.mergeCells('D1', 'O1');
      const titleCell = worksheet.getCell('D1');
      titleCell.value = 'REPORTE DE USUARIOS';
      titleCell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      titleCell.font = {
        bold: true,
        size: 16,
      };

      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`; // Formato DD/MM/YYYY
      const reportDateString = `Fecha de reporte: ${formattedDate}`;
      worksheet.getCell('B1').value = reportDateString;
      worksheet.getCell('B1').font = {
        bold: true,
        size: 12,
      };
      const userString = `Usuario: ${autUsuarioRestriccionFilterDto.usuario}`;
      worksheet.getCell('B2').value = userString;
      worksheet.getCell('B2').font = {
        bold: true,
        size: 12,
      };

      // Definir el ancho de las columnas
      worksheet.getColumn('B').width = 15;
      worksheet.getColumn('C').width = 25;
      worksheet.getColumn('D').width = 20;
      worksheet.getColumn('E').width = 20;
      worksheet.getColumn('F').width = 20;
      worksheet.getColumn('G').width = 10;
      worksheet.getColumn('H').width = 30;
      worksheet.getColumn('I').width = 20;
      worksheet.getColumn('J').width = 20;
      worksheet.getColumn('K').width = 30;
      worksheet.getColumn('L').width = 30;
      worksheet.getColumn('M').width = 20;
      worksheet.getColumn('N').width = 20;
      worksheet.getColumn('O').width = 20;
      worksheet.getColumn('P').width = 30;
      worksheet.getColumn('Q').width = 15;

      // 2. Desplaza los encabezados y los datos una fila hacia abajo
      const headers = [
        'No.',
        'USUARIO',
        'NOMBRES',
        'AP. PATERNO',
        'AP. MATERNO',
        'CARNET ID.',
        'COMP.',
        'EMAIL',
        'TELEFONO',
        'NIVEL',
        'SUBSECTOR',
        'INSTITUCION',
        'DEPARTAMENTO',
        'RED/AREA',
        'MUNICIPIO',
        'ESTABLECIMIENTO',
        'ESTADO',
      ];
      worksheet.addRow([]); // Agregar una fila vacía

      // Añadir los encabezados
      const headerRow = worksheet.addRow(headers);

      // Estilizar las cabeceras
      headerRow.eachCell((cell, colNumber) => {
        cell.font = {
          bold: true,
          size: 12,
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFC0C0C0' },
          bgColor: { argb: 'FFC0C0C0' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      let rowIndex = 1;
      for (const item of data) {
        const row = worksheet.addRow([
          rowIndex,
          item.usuario,
          item.nombres,
          item.primerApellido,
          item.segundoApellido,
          item.numeroDocumento,
          item.complemento,
          item.correoElectronico.trim(),
          item.telefono,
          item.idcNivel,
          item.nombreSubsector,
          item.nombreInstitucion,
          item.nombreDepartamento,
          item.nombreArea,
          item.nombreMunicipio,
          item.nombreEstablecimiento,
          item.estadoUsuario,
        ]);
        rowIndex++;

        // Estilizar cada celda de la fila con bordes
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }

      const filePath = `${process.env.ARCHIVOS}/reporte_usuarios.xlsx`;
      await workbook.xlsx.writeFile(filePath);
      //await workbook.xlsx.writeFile('usuarios_reporte.xlsx');
      const downloadLink = `/ruta/reporte_usuarios.xlsx`;
      //console.log(downloadLink);
      return this._respuestaService.respuestaHttp(
        true,
        downloadLink,
        ruta,
        `Reporte exitoso`,
      );
    } catch (e) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Comunicate con soporte ${e.error}`,
      );
    }
  }

  findAllUsuarioExcel() {
    const ruta = this._main + '/ findAllUsuarioExcel';
    try {
      const data = this._autUsuario.find();
      return this._respuestaService.respuestaHttp(true, data, ruta, 'correcto');
    } catch (e) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${e.message}`,
      );
    }
  }

  async findOne(id: number): Promise<RespuestaM> {
    const ruta = this._main + '/ findOne';
    let usuario = null;
    try {
      usuario = await this._autUsuario.findOneBy({
        idPersona: id,
      });
      if (usuario) {
        return this._respuestaService.respuestaHttp(
          true,
          usuario,
          null,
          'Listado Exitoso',
        );
      } else {
        return this._respuestaService.respuestaHttp(
          false,
          usuario,
          ruta,
          'No existe el usuario',
        );
      }
    } catch (e) {
      //console.log(e);
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error comuniquese con soporte ${e.message}`,
      );
    }
  }

  async findUsuario(username: string): Promise<RespuestaM> {
    const ruta = this._main + '/ findUsuario';
    let usuarioResponse = null;
    try {
      usuarioResponse = await this._autUsuario.findOneBy({
        usuario: username,
      });
      if (!usuarioResponse) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          null,
          'No existe el usuario',
        );
      } else {
        return this._respuestaService.respuestaHttp(
          true,
          usuarioResponse,
          null,
          'Usuario Encontrado',
        );
      }
    } catch (e) {
      //console.log(e);
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error comuniquese con soporte ${e.message}`,
      );
    }
  }

  async findUsuarioByCorreo(correo: string): Promise<RespuestaM> {
    const ruta = this._main + '/ findUsuarioByCorreo';
    let usuarioResponse = null;
    try {
      usuarioResponse = await this._autUsuario.findOneBy({
        correoElectronico: correo,
      });
      if (!usuarioResponse) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          null,
          'No existe el usuario',
        );
      } else {
        return this._respuestaService.respuestaHttp(
          true,
          usuarioResponse,
          null,
          'Correo electronico Encontrado',
        );
      }
    } catch (e) {
      console.log(e);
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error comuniquese con soporte ${e.message}`,
      );
    }
  }

  async createAutUsuario(createAutUsuario: CreateAutUsuarioDto) {
    const ruta = this._main + '/ createAutUsuario';
    try {
      const create = this._autUsuario.create(createAutUsuario);
      const respuesta = await this._autUsuario.save(create);
      console.log('usuario guardado' + respuesta.usuario);
      return respuesta.usuario;
    } catch (e) {
      console.log(e);
    }
  }

  async updateAutUsuario(id: number, updateAutUsuario: UpdateAutUsuarioDto) {
    const ruta = this._main + '/ updateAutUsuario';
    try {
      const usuario = await this._autUsuario.findOneBy({
        idPersona: id,
      });
      usuario.usuarioModificacion = 'postgres';
      this._autUsuario.merge(usuario, updateAutUsuario);
      return await this._autUsuario.save(usuario);
    } catch (e) {
      console.log(e);
    }
  }

  async findByUsuarioAllRelations(username: string): Promise<RespuestaM> {
    let usuarioResponse = null;
    try {
      const fusion = {
        usuario: {
          usuario: 'eitner.montero',
          correoElectronico: 'eitnermontero@gmail.com',
          telefono: '75118536',
          idcTipoUsuario: 'TIPO_USUARIO_INTERNO',
          idcEstado: 'ESTADO_USUARIO_HABILITADO',
          nombreEstado: 'Habilitado',
        },
        usuarioRestriccion: {
          idSistema: 1,
          nombreSistema: 'AUTORIZACION',
          idInstitucion: 1,
          nombreInstitucion: 'MINSALUD',
          idcSubsector: 'SUB_SECTOR_PUBLICO',
          nombreSubsector: 'Público',
          idcNivel: 'NACIONAL',
          nombreNivel: 'Nacional',
          idNivel: 32,
          codDepartamento: null,
          departamento: null,
          codProvincia: null,
          provincia: null,
          codArea: null,
          area: null,
          codMunicipio: null,
          municipio: null,
          codEstablecimiento: null,
          establecimiento: null,
        },
        persona: {
          idPersona: 1,
          numeroDocumento: '5808569',
          complemento: '1B',
          complementoVisible: false,
          nombres: 'EITNER',
          primerApellido: 'MONTERO',
          segundoApellido: 'CHURATA',
          fechaNacimiento: '16/06/1985',
          expedicion: 'TJ',
          verificacionSegip: true,
        },
        profesionPersona: {
          idGrupoProfesion: 97,
          nombreGrupoProfesion:
            'PERSONAL DE SISTEMAS                                                                                ',
          nombreDescripcionProfesion: 'LIC. EN INFORMATICA',
          matriculaProfesional: '5808569',
        },
        listaRecursos: [
          {
            idRecurso: 10,
            idRecursoSuperior: null,
            idTipoRecurso: 1,
            nombreTipoRecurso: 'Menu',
            uri: 'EMISIÓN NACIDO VIVO',
            nombreRecurso: 'EMISIÓN NACIDO VIVO',
            esVisible: true,
            orden: 1,
            icono: 'fas fa-file-signature',
          },
          {
            idRecurso: 11,
            idRecursoSuperior: null,
            idTipoRecurso: 1,
            nombreTipoRecurso: 'Menu',
            uri: 'transcripcion',
            nombreRecurso: 'TRANSCRIPCIÓN',
            esVisible: true,
            orden: 2,
            icono: 'fas fa-copy',
          },
          {
            idRecurso: 15,
            idRecursoSuperior: null,
            idTipoRecurso: 1,
            nombreTipoRecurso: 'Menu',
            uri: 'saneamiento_es',
            nombreRecurso: 'SANEAMIENTO EN E.S.',
            esVisible: true,
            orden: 6,
            icono: 'fas fa-copy',
          },
          {
            idRecurso: 16,
            idRecursoSuperior: 10,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/certificadonacidovivo/certificados-nacidos-vivos/EMISOR',
            nombreRecurso: 'Registro Nacido vivo',
            esVisible: true,
            orden: 1,
            icono: 'fas fa-baby',
          },
          {
            idRecurso: 18,
            idRecursoSuperior: 11,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/certificadonacidovivo/certificados-nacidos-vivos/TRANSCRIPTOR',
            nombreRecurso: 'Nacido vivo',
            esVisible: true,
            orden: 1,
            icono: 'fas fa-baby',
          },
          {
            idRecurso: 20,
            idRecursoSuperior: 12,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/certificadonacidovivo/controlcalidad',
            nombreRecurso: 'Nacido vivo',
            esVisible: true,
            orden: 1,
            icono: 'fas fa-baby',
          },
          {
            idRecurso: 21,
            idRecursoSuperior: 12,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/certificadodefuncion/controlcalidad',
            nombreRecurso: 'Defunción',
            esVisible: true,
            orden: 2,
            icono: 'fas fa-cross',
          },
          {
            idRecurso: 26,
            idRecursoSuperior: 15,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/saneamiento/solicitud-saneamiento',
            nombreRecurso: 'Solicitud Saneamiento',
            esVisible: true,
            orden: 1,
            icono: 'fas fa-baby',
          },
          {
            idRecurso: 27,
            idRecursoSuperior: null,
            idTipoRecurso: 1,
            nombreTipoRecurso: 'Menu',
            uri: 'saneamiento_sedes',
            nombreRecurso: 'SANEAMIENTO EN SEDES',
            esVisible: true,
            orden: 7,
            icono: 'fas fa-baby',
          },
          {
            idRecurso: 28,
            idRecursoSuperior: 27,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/saneamiento/revision-saneamiento',
            nombreRecurso: 'Revisión Saneamiento',
            esVisible: true,
            orden: 1,
            icono: 'fas fa-baby',
          },
          {
            idRecurso: 29,
            idRecursoSuperior: null,
            idTipoRecurso: 1,
            nombreTipoRecurso: 'Menu',
            uri: 'EMISIÓN DEFUNCIÓN',
            nombreRecurso: 'EMISIÓN DEFUNCIÓN',
            esVisible: true,
            orden: 2,
            icono: 'fas fa-file-signature',
          },
          {
            idRecurso: 30,
            idRecursoSuperior: 29,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/certificadodefuncion/certificados-defunciones/EMISOR',
            nombreRecurso: 'Registro Defunción',
            esVisible: true,
            orden: 1,
            icono: 'fas fa-cross',
          },
          {
            idRecurso: 31,
            idRecursoSuperior: 29,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/certificadodefuncion/controlcalidad',
            nombreRecurso: 'Validación Defunción',
            esVisible: true,
            orden: 2,
            icono: 'fas fa-cross',
          },
          {
            idRecurso: 32,
            idRecursoSuperior: null,
            idTipoRecurso: 1,
            nombreTipoRecurso: 'Menu',
            uri: 'REPORTE DEFUNCIÓN',
            nombreRecurso: 'REPORTE DEFUNCIÓN',
            esVisible: true,
            orden: 2,
            icono: 'fa fa-file-chart-column',
          },
          {
            idRecurso: 33,
            idRecursoSuperior: 32,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/reportes/reporte-defuncion-bd',
            nombreRecurso: 'Base de Datos',
            esVisible: true,
            orden: 1,
            icono: 'fas fa-cross',
          },
          {
            idRecurso: 34,
            idRecursoSuperior: 32,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/reportes/reporte-defuncion',
            nombreRecurso: 'Estadístico',
            esVisible: true,
            orden: 2,
            icono: 'fas fa-cross',
          },
          {
            idRecurso: 35,
            idRecursoSuperior: 10,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/certificadonacidovivo/controlcalidad',
            nombreRecurso: 'Validación Nacido Vivo',
            esVisible: true,
            orden: 2,
            icono: 'fas fa-baby',
          },
          {
            idRecurso: 36,
            idRecursoSuperior: null,
            idTipoRecurso: 1,
            nombreTipoRecurso: 'Menu',
            uri: 'REPORTE NACIDO VIVO',
            nombreRecurso: 'REPORTE NACIDO VIVO',
            esVisible: true,
            orden: 4,
            icono: 'fa fa-file-chart-column',
          },
          {
            idRecurso: 37,
            idRecursoSuperior: 36,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/reportes/reporte-nacido-vivo-bd',
            nombreRecurso: 'Base de Datos',
            esVisible: true,
            orden: 1,
            icono: 'fas fa-baby',
          },
          {
            idRecurso: 38,
            idRecursoSuperior: 36,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/reportes/reporte-nacido-vivo',
            nombreRecurso: 'Estadistico',
            esVisible: true,
            orden: 2,
            icono: 'fas fa-baby',
          },
          {
            idRecurso: 39,
            idRecursoSuperior: 11,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/certificadodefuncion/certificados-defunciones/TRANSCRIPTOR',
            nombreRecurso: 'Defunción',
            esVisible: true,
            orden: 2,
            icono: 'fas fa-cross',
          },
          {
            idRecurso: 40,
            idRecursoSuperior: null,
            idTipoRecurso: 1,
            nombreTipoRecurso: 'Menu',
            uri: 'CODIFICACIÓN',
            nombreRecurso: 'CODIFICACIÓN',
            esVisible: true,
            orden: 3,
            icono: 'fas fa-file-signature',
          },
          {
            idRecurso: 41,
            idRecursoSuperior: 40,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/certificadodefuncion/codificacion',
            nombreRecurso: 'CODIFICACIÓN DEFUNCIÓN',
            esVisible: true,
            orden: 1,
            icono: 'fas fa-cross',
          },
          {
            idRecurso: 42,
            idRecursoSuperior: 11,
            idTipoRecurso: 2,
            nombreTipoRecurso: 'Componente',
            uri: '/app/certificadodefuncionperinatal/certificados-defunciones-perinatales/TRANSCRIPTOR',
            nombreRecurso: 'Defunción Perinatal',
            esVisible: true,
            orden: 3,
            icono: 'fas fa-cross',
          },
        ],
      };
      return this._respuestaService.respuestaHttp(
        true,
        fusion,
        null,
        'Usuario Encontrado',
      );
      //desde aqui arreglar el codigo
      usuarioResponse = await this.findUsuario(username);
      if (!usuarioResponse) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          null,
          'No existe el usuario',
        );
      } else {
        //Eliminar campos de usuario no necesarios
        delete usuarioResponse.data.contrasenia;
        delete usuarioResponse.data.contraseniaReset;
        delete usuarioResponse.data.fechaRegistro;
        delete usuarioResponse.data.usuarioRegistro;
        delete usuarioResponse.data.fechaModificacion;
        delete usuarioResponse.data.ipRegistro;
        delete usuarioResponse.data.bajaLogicaRegistro;
        delete usuarioResponse.data.usuarioModificacion;
        const usuario = { autUsuario: usuarioResponse.data };
        //----------
        //const personaResponse = await this._personaService.findOne(usuarioResponse.data.idPersona);
        //const fusion = {usuario,...personaResponse};
        const fusion = {
          usuario: {
            usuario: {
              usuario: 'eitner.montero',
              correoElectronico: 'eitnermontero@gmail.com',
              telefono: '75118536',
              idcTipoUsuario: 'TIPO_USUARIO_INTERNO',
              idcEstado: 'ESTADO_USUARIO_HABILITADO',
              nombreEstado: 'Habilitado',
            },
            usuarioRestriccion: {
              idSistema: 1,
              nombreSistema: 'AUTORIZACION',
              idInstitucion: 1,
              nombreInstitucion: 'MINSALUD',
              idcSubsector: 'SUB_SECTOR_PUBLICO',
              nombreSubsector: 'Público',
              idcNivel: 'NACIONAL',
              nombreNivel: 'Nacional',
              idNivel: 32,
              codDepartamento: null,
              departamento: null,
              codProvincia: null,
              provincia: null,
              codArea: null,
              area: null,
              codMunicipio: null,
              municipio: null,
              codEstablecimiento: null,
              establecimiento: null,
            },
            persona: {
              idPersona: 1,
              numeroDocumento: '5808569',
              complemento: '1B',
              complementoVisible: false,
              nombres: 'EITNER',
              primerApellido: 'MONTERO',
              segundoApellido: 'CHURATA',
              fechaNacimiento: '16/06/1985',
              expedicion: 'TJ',
              verificacionSegip: true,
            },
            profesionPersona: {
              idGrupoProfesion: 97,
              nombreGrupoProfesion:
                'PERSONAL DE SISTEMAS                                                                                ',
              nombreDescripcionProfesion: 'LIC. EN INFORMATICA',
              matriculaProfesional: '5808569',
            },
            listaRecursos: [
              {
                idRecurso: 10,
                idRecursoSuperior: null,
                idTipoRecurso: 1,
                nombreTipoRecurso: 'Menu',
                uri: 'EMISIÓN NACIDO VIVO',
                nombreRecurso: 'EMISIÓN NACIDO VIVO',
                esVisible: true,
                orden: 1,
                icono: 'fas fa-file-signature',
              },
              {
                idRecurso: 11,
                idRecursoSuperior: null,
                idTipoRecurso: 1,
                nombreTipoRecurso: 'Menu',
                uri: 'transcripcion',
                nombreRecurso: 'TRANSCRIPCIÓN',
                esVisible: true,
                orden: 2,
                icono: 'fas fa-copy',
              },
              {
                idRecurso: 15,
                idRecursoSuperior: null,
                idTipoRecurso: 1,
                nombreTipoRecurso: 'Menu',
                uri: 'saneamiento_es',
                nombreRecurso: 'SANEAMIENTO EN E.S.',
                esVisible: true,
                orden: 6,
                icono: 'fas fa-copy',
              },
              {
                idRecurso: 16,
                idRecursoSuperior: 10,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/certificadonacidovivo/certificados-nacidos-vivos/EMISOR',
                nombreRecurso: 'Registro Nacido vivo',
                esVisible: true,
                orden: 1,
                icono: 'fas fa-baby',
              },
              {
                idRecurso: 18,
                idRecursoSuperior: 11,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/certificadonacidovivo/certificados-nacidos-vivos/TRANSCRIPTOR',
                nombreRecurso: 'Nacido vivo',
                esVisible: true,
                orden: 1,
                icono: 'fas fa-baby',
              },
              {
                idRecurso: 20,
                idRecursoSuperior: 12,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/certificadonacidovivo/controlcalidad',
                nombreRecurso: 'Nacido vivo',
                esVisible: true,
                orden: 1,
                icono: 'fas fa-baby',
              },
              {
                idRecurso: 21,
                idRecursoSuperior: 12,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/certificadodefuncion/controlcalidad',
                nombreRecurso: 'Defunción',
                esVisible: true,
                orden: 2,
                icono: 'fas fa-cross',
              },
              {
                idRecurso: 26,
                idRecursoSuperior: 15,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/saneamiento/solicitud-saneamiento',
                nombreRecurso: 'Solicitud Saneamiento',
                esVisible: true,
                orden: 1,
                icono: 'fas fa-baby',
              },
              {
                idRecurso: 27,
                idRecursoSuperior: null,
                idTipoRecurso: 1,
                nombreTipoRecurso: 'Menu',
                uri: 'saneamiento_sedes',
                nombreRecurso: 'SANEAMIENTO EN SEDES',
                esVisible: true,
                orden: 7,
                icono: 'fas fa-baby',
              },
              {
                idRecurso: 28,
                idRecursoSuperior: 27,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/saneamiento/revision-saneamiento',
                nombreRecurso: 'Revisión Saneamiento',
                esVisible: true,
                orden: 1,
                icono: 'fas fa-baby',
              },
              {
                idRecurso: 29,
                idRecursoSuperior: null,
                idTipoRecurso: 1,
                nombreTipoRecurso: 'Menu',
                uri: 'EMISIÓN DEFUNCIÓN',
                nombreRecurso: 'EMISIÓN DEFUNCIÓN',
                esVisible: true,
                orden: 2,
                icono: 'fas fa-file-signature',
              },
              {
                idRecurso: 30,
                idRecursoSuperior: 29,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/certificadodefuncion/certificados-defunciones/EMISOR',
                nombreRecurso: 'Registro Defunción',
                esVisible: true,
                orden: 1,
                icono: 'fas fa-cross',
              },
              {
                idRecurso: 31,
                idRecursoSuperior: 29,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/certificadodefuncion/controlcalidad',
                nombreRecurso: 'Validación Defunción',
                esVisible: true,
                orden: 2,
                icono: 'fas fa-cross',
              },
              {
                idRecurso: 32,
                idRecursoSuperior: null,
                idTipoRecurso: 1,
                nombreTipoRecurso: 'Menu',
                uri: 'REPORTE DEFUNCIÓN',
                nombreRecurso: 'REPORTE DEFUNCIÓN',
                esVisible: true,
                orden: 2,
                icono: 'fa fa-file-chart-column',
              },
              {
                idRecurso: 33,
                idRecursoSuperior: 32,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/reportes/reporte-defuncion-bd',
                nombreRecurso: 'Base de Datos',
                esVisible: true,
                orden: 1,
                icono: 'fas fa-cross',
              },
              {
                idRecurso: 34,
                idRecursoSuperior: 32,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/reportes/reporte-defuncion',
                nombreRecurso: 'Estadístico',
                esVisible: true,
                orden: 2,
                icono: 'fas fa-cross',
              },
              {
                idRecurso: 35,
                idRecursoSuperior: 10,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/certificadonacidovivo/controlcalidad',
                nombreRecurso: 'Validación Nacido Vivo',
                esVisible: true,
                orden: 2,
                icono: 'fas fa-baby',
              },
              {
                idRecurso: 36,
                idRecursoSuperior: null,
                idTipoRecurso: 1,
                nombreTipoRecurso: 'Menu',
                uri: 'REPORTE NACIDO VIVO',
                nombreRecurso: 'REPORTE NACIDO VIVO',
                esVisible: true,
                orden: 4,
                icono: 'fa fa-file-chart-column',
              },
              {
                idRecurso: 37,
                idRecursoSuperior: 36,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/reportes/reporte-nacido-vivo-bd',
                nombreRecurso: 'Base de Datos',
                esVisible: true,
                orden: 1,
                icono: 'fas fa-baby',
              },
              {
                idRecurso: 38,
                idRecursoSuperior: 36,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/reportes/reporte-nacido-vivo',
                nombreRecurso: 'Estadistico',
                esVisible: true,
                orden: 2,
                icono: 'fas fa-baby',
              },
              {
                idRecurso: 39,
                idRecursoSuperior: 11,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/certificadodefuncion/certificados-defunciones/TRANSCRIPTOR',
                nombreRecurso: 'Defunción',
                esVisible: true,
                orden: 2,
                icono: 'fas fa-cross',
              },
              {
                idRecurso: 40,
                idRecursoSuperior: null,
                idTipoRecurso: 1,
                nombreTipoRecurso: 'Menu',
                uri: 'CODIFICACIÓN',
                nombreRecurso: 'CODIFICACIÓN',
                esVisible: true,
                orden: 3,
                icono: 'fas fa-file-signature',
              },
              {
                idRecurso: 41,
                idRecursoSuperior: 40,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/certificadodefuncion/codificacion',
                nombreRecurso: 'CODIFICACIÓN DEFUNCIÓN',
                esVisible: true,
                orden: 1,
                icono: 'fas fa-cross',
              },
              {
                idRecurso: 42,
                idRecursoSuperior: 11,
                idTipoRecurso: 2,
                nombreTipoRecurso: 'Componente',
                uri: '/app/certificadodefuncionperinatal/certificados-defunciones-perinatales/TRANSCRIPTOR',
                nombreRecurso: 'Defunción Perinatal',
                esVisible: true,
                orden: 3,
                icono: 'fas fa-cross',
              },
            ],
          },
        };
        return this._respuestaService.respuestaHttp(
          true,
          fusion,
          null,
          'Usuario Encontrado',
        );
      }
    } catch (e) {
      console.log(e);
      return this._respuestaService.respuestaHttp(false, null, '', 'Error 500');
    }
  }

  async reporteUsuario() {
    const ruta = this._main + ' /reporteUsuario';
    try {
      const reporte = await this.autUsuarioRepository.reporteUusuarios();
      if (!reporte) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          `Comunicate con soporte ${error}`,
        );
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Usuarios');

      // 1. Crear el título "Reporte de Usuarios" en la fila 1 entre las columnas D e I
      worksheet.mergeCells('D1', 'I1');
      const titleCell = worksheet.getCell('D1');
      titleCell.value = 'REPORTE DE USUARIOS';
      titleCell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      titleCell.font = {
        bold: true,
        size: 16,
      };

      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`; // Formato DD/MM/YYYY
      const reportDateString = `Fecha de reporte: ${formattedDate}`;
      worksheet.getCell('B1').value = reportDateString;
      worksheet.getCell('B1').font = {
        bold: true,
        size: 12,
      };

      // Definir el ancho de las columnas
      worksheet.getColumn('B').width = 15;
      worksheet.getColumn('C').width = 25;
      worksheet.getColumn('D').width = 20;
      worksheet.getColumn('E').width = 20;
      worksheet.getColumn('F').width = 20;
      worksheet.getColumn('G').width = 20;
      worksheet.getColumn('H').width = 30;
      worksheet.getColumn('I').width = 20;
      worksheet.getColumn('J').width = 20;
      worksheet.getColumn('K').width = 20;

      // 2. Desplaza los encabezados y los datos una fila hacia abajo
      const headers = [
        'No.',
        'USUARIO',
        'MATRICULA PROFESIONAL',
        'CARNET ID.',
        'NOMBRES',
        'AP. PATERNO',
        'AP. MATERNO',
        'EMAIL',
        'PROFESION',
        'TIPO REGISTRO',
        'ESTADO',
      ];
      worksheet.addRow([]); // Agregar una fila vacía

      // Añadir los encabezados
      const headerRow = worksheet.addRow(headers);

      // Estilizar las cabeceras
      headerRow.eachCell((cell, colNumber) => {
        cell.font = {
          bold: true,
          size: 12,
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFC0C0C0' },
          bgColor: { argb: 'FFC0C0C0' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      let rowIndex = 1;
      for (const item of reporte) {
        const row = worksheet.addRow([
          rowIndex,
          item.usuario,
          item.matricula_profesional,
          item.numero_documento,
          item.nombres,
          item.primer_apellido,
          item.segundo_apellido,
          item.correo_electronico,
          item.nombre_grupo_profesion.trim(),
          item.tipo_registro,
          item.nombre_clasificador_detalle,
        ]);
        rowIndex++;

        // Estilizar cada celda de la fila con bordes
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }

      const filePath = `${process.env.ARCHIVOS}/reporte_usuarios.xlsx`;
      await workbook.xlsx.writeFile(filePath);
      //await workbook.xlsx.writeFile('usuarios_reporte.xlsx');
      const downloadLink = `/ruta/reporte_usuarios.xlsx`;

      return this._respuestaService.respuestaHttp(
        true,
        downloadLink,
        null,
        `Reporte exitoso`,
      );
    } catch (e) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Comunicate con soporte ${e.error}`,
      );
    }
  }

  async listarUsuarioReporte() {
    const ruta = this._main + ' /reporteUsuario';
    try {
      const reporte = await this.autUsuarioRepository.reporteUusuarios();
      if (!reporte) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          `Comunicate con soporte ${error}`,
        );
      }

      return this._respuestaService.respuestaHttp(
        true,
        transformaCamelCaseArrayObjeto(reporte),
        null,
        `Reporte exitoso`,
      );
    } catch (e) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Comunicate con soporte ${e.error}`,
      );
    }
  }

  async listarPerfilRecursoByUsuario(dto: ContextoDto) {
    const ruta = this._main + ' /listarPerfilRecursoByUsuario';
    try {
      const valorIdSistema = await this.findUsuario(dto.usuario);
      if (!valorIdSistema.data) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          `No Existe el Usuario`,
        );
      }
      const resultado = [];
      const idPerfilesUsuario =
        await this.autUsuarioRepository.listaUsuarioPerfilAsignado(dto.usuario, dto.idUsuarioRestriccion);
        for (let i = 0; i < idPerfilesUsuario.length; i++) {
        resultado.push(
          await this.autUsuarioRepository.listarPerfilRecursoByUsuario(
            idPerfilesUsuario[i].id_perfil,
            idPerfilesUsuario[i].id_recurso_superior,
          ),
        );
      }
      const resp = [];
      resultado.map((datos, index) => {
        datos.map((data) => {
          resp.push(data);
        });
      });
      const listaRecurso = AutUsuarioPerfilRecursoMapper_EntitiesToDtos(resp);
      const array = {
        usuario: await this.autUsuarioRepository.findByPersonaByUsuario(
          dto.usuario,
        ),
      };
      const prueba = {
        usuarioRestriccion: await this.autUsuarioRepository.usuarioRestriccion(
          dto.sistema,
          dto.usuario,
          dto.idUsuarioRestriccion,
        ),
      };
      const data2 = { listaRecurso };
      const data3 = { listaRecurso: this.procesarRecursos(data2.listaRecurso) };
      const fusion = { ...array, ...prueba, ...data3 };

      //agregando para pruebas
      const eliminarDuplicados = (lista) => {
        const recursosUnicos = {};
        return lista.filter((recurso) => {
          if (recursosUnicos[recurso.idRecurso]) {
            return false;
          } else {
            recursosUnicos[recurso.idRecurso] = true;
            return true;
          }
        });
      };

      const eliminarDuplicadosPorNombre = (lista) => {
        const nombresVistos = new Set();
        return lista.filter((recurso) => {
          if (nombresVistos.has(recurso.nombreRecurso)) {
            return false;
          } else {
            nombresVistos.add(recurso.nombreRecurso);
            return true;
          }
        });
      };

      // Eliminando duplicados en listaRecurso por nombreRecurso
      fusion.listaRecurso = eliminarDuplicadosPorNombre(fusion.listaRecurso);

      // Aplicar la función para eliminar duplicados en cada listaDeRecurso por idRecurso
      fusion.listaRecurso.forEach((recurso) => {
        recurso.listaDeRecurso = eliminarDuplicados(recurso.listaDeRecurso);
      });
      //fin de las pruebas

      return this._respuestaService.respuestaHttp(
        true,
        fusion,
        ruta,
        'Listado Correcto',
      );
    } catch (e) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Comunicate con soporte ${e.error}`,
      );
    }
  }

  procesarRecursos(
    recursos: Recurso[],
    idRecursoSuperior: number | null = null,
    processedSet: Set<number> = new Set(),
  ): any[] {
    const recursosFiltrados = recursos.filter(
      (recurso) => recurso.idRecursoSuperior === idRecursoSuperior,
    );
    recursosFiltrados.sort((a, b) => a.orden - b.orden);
    return recursosFiltrados.map((recurso) => {
      const esSuperior = recursos.some(
        (r) => r.idRecursoSuperior === recurso.idRecurso,
      );
      const recursoJson = {
        idRecurso: recurso.idRecurso,
        idRecursoSuperior: recurso.idRecursoSuperior,
        idTipoRecurso: recurso.idTipoRecurso,
        nombreTipoRecurso: recurso.nombreTipoRecurso,
        uri: recurso.uri,
        nombreRecurso: recurso.nombreRecurso,
        esVisible: recurso.esVisible,
        orden: recurso.orden,
        icono: recurso.icono,
        nombreRecursoSuperior: recurso.nombreRecursoSuperior,
        bajaLogicaRegistro: recurso.bajaLogicaRegistro,
        esSuperior: esSuperior,
        listaDeRecurso: this.procesarRecursos(
          recursos,
          recurso.idRecurso,
          processedSet,
        ),
      };
      processedSet.add(recurso.idRecurso); // Agregar el ID del recurso actual al conjunto de recursos procesados
      return recursoJson;
    });
  }

  async deleteLogicoUsuario(
    idPersona: number,
    usuario: string,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteLogicoUsuario';
    const updateAutUsuario = new UpdateAutUsuarioDto();

    try {
      const usuarioDet = await this._autUsuario.findOneBy({
        idPersona: idPersona,
      });

      if (!usuarioDet)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
        updateAutUsuario.bajaLogicaRegistro = true;
        updateAutUsuario.usuarioModificacion = usuario;
      this._autUsuario.merge(
        usuarioDet,
        updateAutUsuario,
      );

      const updateConsolidado = await this._autUsuario.save(
        usuarioDet,
      );

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        usuario: updateConsolidado.usuario,
      };
      return this._respuestaService.respuestaHttp(
        true,
        resp,
        ruta,
        'Eliminacion Correcta',
      );
    } catch (error) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${error.message}`,
      );
    }
  }
}
interface Recurso {
  idRecurso: number;
  idRecursoSuperior: number | null;
  idTipoRecurso: number;
  nombreTipoRecurso: string;
  uri: string;
  nombreRecurso: string;
  esVisible: boolean;
  orden: number;
  icono: string;
  nombreRecursoSuperior: string | null;
  bajaLogicaRegistro: boolean;
}
