import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'pg';
import { AutRecursoRepository } from '../../repositories/impl/aut-recurso.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AutUsuarioRestriccion } from '../../core/domains/entities';
import { Repository } from 'typeorm';
import { RespuestaM } from '../../../../core/domain/models/respuesta.model';
import {
  formatoFecha,
  transformaCamelCaseArrayObjeto,
} from '../../../../common/utility/all.utill';
import { RespuestaConsultaEnum } from '../../../../core/enum/respuesta-consulta.enum';
import { RespuestaService } from '../../../shared/services/respuesta.service';
import { AutRecursoMapper_EntitiesToDtos } from '../../mapper/aut-recurso.mapper';
import {
  CreateAutUsuarioRestriccionDto,
  CreateUsuarioRestriccionIdPerfilesDto,
  FindUsuariosDto,
  UpdateAutUsuarioRestriccionDto,
  UpdateUsuarioRestriccionIdPerfilesDto,
} from '../../core/domains/dtos/aut-usuario-restriccion.dto';
import { map } from 'rxjs/operators';
import {
  ParSistemaService,
  ParTipoRecursoService,
} from '../../../parametros/services/impl';
import { UpdateParClasificadorDetalleDto } from '../../../parametros/core/domains/dtos/par-clasificador-detalle.dto';
import { AutUsuarioRestriccionRepository } from '../../repositories/impl/aut-usuario-restriccion.repository';
import { UpdateParClasificadorDto } from '../../../parametros/core/domains/dtos/par-clasificador.dto';
import { AutUsuarioRestriccionPerfilService } from './aut-usuario-restriccion-perfil.service';
import { CreateAutUsuarioRestriccionPerfil } from '../../core/domains/dtos/aut-usuario-restriccion-perfil.dto';

@Injectable()
export class AutUsuarioRestriccionService {
  _autUsarioRestriccionRepository: AutUsuarioRestriccionRepository;
  _main = 'AutRecursoService';
  private logger = new Logger('AutRecursoService');
  constructor(
    @Inject('PG') private _client: Client,
    @InjectRepository(AutUsuarioRestriccion)
    private _autUsuarioRestriccion: Repository<AutUsuarioRestriccion>,
    private _respuestaService: RespuestaService,
    private _parSistemaService: ParSistemaService,
    private _autUsarioRestriccionPerfilService: AutUsuarioRestriccionPerfilService,
  ) {
    this._autUsarioRestriccionRepository = new AutUsuarioRestriccionRepository(
      _client,
    );
    // this._autRecursoRepository = new AutRecursoRepository(_client);
  }

  async createAutUsuarioRestriccion(
    autUsuarioRestriccionDto: CreateAutUsuarioRestriccionDto,
  ) {
    const ruta = this._main + '/ createAutRecurso';
    try {
      const parSistema = await this._parSistemaService.findByIdSistema(
        autUsuarioRestriccionDto.idSistema,
      );
      if (!parSistema.data) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'el id sistema no existe',
        );
      }

      /*const validarCreacion = await this._autUsuarioRestriccion.find({
        select:{
          usuario:true,
        },
        where:{
          usuario:autUsuarioRestriccionDto.usuario,
          idSistema:autUsuarioRestriccionDto.idSistema,
        }
      });
      if(validarCreacion.length>0){
        return this._respuestaService.respuestaHttp(
            false,
            null,
            ruta,
            'Usuario ya se encuentra registrado en el sistema ingresado',
        );
      }*/
      const newAutUsuarioRestriccion = this._autUsuarioRestriccion.create(
        autUsuarioRestriccionDto,
      );
      const autUsuarioRestriccion = await this._autUsuarioRestriccion.save(
        newAutUsuarioRestriccion,
      );
      if (autUsuarioRestriccion) {
        const resp = {
          idUsuarioRestriccion: autUsuarioRestriccion.idUsuarioRestriccion,
          idSistema: autUsuarioRestriccion.idSistema,
          idInstitucion: autUsuarioRestriccion.idInstitucion,
          usuario: autUsuarioRestriccion.usuario,
        };
        return this._respuestaService.respuestaHttp(
          true,
          resp,
          ruta,
          'Registro Exitoso',
        );
      }
      return this._respuestaService.respuestaHttp(false, null, null, null);
    } catch (error) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error en el Registro ${error.message}`,
      );
    }
  }

  async updateAutUsuarioRestriccion(
    idAutUsuarioRestriccion: number,
    updateAutUsuarioRestriccion: UpdateAutUsuarioRestriccionDto,
  ) {
    const ruta = this._main + '/ updateAutUsuarioRestriccion';
    try {
      const respAutUsuarioRestriccion =
        await this._autUsuarioRestriccion.findOneBy({
          idUsuarioRestriccion: idAutUsuarioRestriccion,
        });
      if (!respAutUsuarioRestriccion)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      const parSistema = await this._parSistemaService.findByIdSistema(
        updateAutUsuarioRestriccion.idSistema,
      );
      if (!parSistema.data) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'el id sistema no existe',
        );
      }
      this._autUsuarioRestriccion.merge(
        respAutUsuarioRestriccion,
        updateAutUsuarioRestriccion,
      );

      const updateConsolidado = await this._autUsuarioRestriccion.save(
        respAutUsuarioRestriccion,
      );
      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idAutUsuarioRestriccion: updateConsolidado.idUsuarioRestriccion,
        usuario: updateConsolidado.usuario,
      };
      return this._respuestaService.respuestaHttp(
        true,
        resp,
        ruta,
        'Modificacion Correcta',
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

  async updateAutUsuarioRestriccion2(
    usuario: string,
    updateAutUsuarioRestriccion: UpdateAutUsuarioRestriccionDto,
  ) {
    const ruta = this._main + '/ updateAutUsuarioRestriccion';
    try {
      const respAutUsuarioRestriccion =
        await this._autUsuarioRestriccion.findOneBy({
          usuario: usuario,
        });
      if (!respAutUsuarioRestriccion)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      const parSistema = await this._parSistemaService.findByIdSistema(
        updateAutUsuarioRestriccion.idSistema,
      );
      if (!parSistema.data) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'el id sistema no existe',
        );
      }
      this._autUsuarioRestriccion.merge(
        respAutUsuarioRestriccion,
        updateAutUsuarioRestriccion,
      );

      const updateConsolidado = await this._autUsuarioRestriccion.save(
        respAutUsuarioRestriccion,
      );
      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idAutUsuarioRestriccion: updateConsolidado.idUsuarioRestriccion,
        usuario: updateConsolidado.usuario,
      };
      return this._respuestaService.respuestaHttp(
        true,
        resp.idAutUsuarioRestriccion,
        ruta,
        'Modificacion Correcta',
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
  async usuarioFindByIdAll(dto: FindUsuariosDto) {
    try {
      const resp = await this._autUsuarioRestriccion.find({
        select: {
          idUsuarioRestriccion: true,
          usuario: true,
          idSistema: true,
          idInstitucion: true,
          idcSubSector: true,
          idcNivel: true,
          idNivel: true,
          codDepartamento: true,
          departamento: true,
          codArea: true,
          area: true,
          codMunicipio: true,
          municipio: true,
          codEstablecimiento: true,
          establecimiento: true,
        },
        where: {
          idInstitucion: dto.idInstitucion,
          idcSubSector: dto.idcSubSector,
          idcNivel: dto.idcNivel,
          codDepartamento: dto.codDepartamento,
          codArea: dto.codArea,
          codMunicipio: dto.codMunicipio,
          codEstablecimiento: dto.codEstablecimiento,
        },
      });
      return this._respuestaService.respuestaHttp(true, resp, null, null);
    } catch (e) {
      return null;
    }
  }

  async findUsuarioRestriccionByUsuario(usuario: string) {
    try {
      const resultado =
        await this._autUsarioRestriccionRepository.findUsuarioRestriccionByUsuario(
          usuario,
        );
      if (!resultado) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          null,
          'No Existe el usuario',
        );
      }
      const resp = [];
      resultado.map((datos) => {
        resp.push(datos.data);
      });
      return this._respuestaService.respuestaHttp(true, resp, null, null);
    } catch (e) {
      return null;
    }
  }
  async updateUsuarioRestriccion(
    idUsuarioRestriccion: number,
    updateUsuarioRestriccion: UpdateAutUsuarioRestriccionDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ updateUsuarioRestriccion';
    try {
      const usuarioRestriccion = await this._autUsuarioRestriccion.findOneBy({
        idUsuarioRestriccion: idUsuarioRestriccion,
      });
      if (!usuarioRestriccion)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      this._autUsuarioRestriccion.merge(
        usuarioRestriccion,
        updateUsuarioRestriccion,
      );

      const updateConsolidado = await this._autUsuarioRestriccion.save(
        usuarioRestriccion,
      );

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idUsuarioRestriccion: updateConsolidado.idUsuarioRestriccion,
        usuario: updateConsolidado.usuario,
      };
      return this._respuestaService.respuestaHttp(
        true,
        resp,
        ruta,
        'Modificacion Correcta',
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
  async createAutUsuarioRestriccionPerfiles(
    dto: CreateUsuarioRestriccionIdPerfilesDto,
  ) {
    try {
      const { colIdPerfiles, ...rest } = dto;
      const conversion = this.convertirADTO<
        typeof rest,
        CreateAutUsuarioRestriccionDto
      >(rest);
      const _restriccionPerfiles = new CreateAutUsuarioRestriccionPerfil();
      const creacionUsuarioRestriccion = await this.createAutUsuarioRestriccion(
        conversion,
      );
      if (!creacionUsuarioRestriccion.status)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          null,
          creacionUsuarioRestriccion.message,
        );
      //const dtos = [];
      _restriccionPerfiles.idUsuarioRestriccion =
        creacionUsuarioRestriccion.data.idUsuarioRestriccion;
      for (let i = 0; i < colIdPerfiles.length; i++) {
        _restriccionPerfiles.idPerfil = colIdPerfiles[i];
        await this._autUsarioRestriccionPerfilService.createRestriccionPerfilOne(
          _restriccionPerfiles,
        );
      }
      return this._respuestaService.respuestaHttp(
        true,
        creacionUsuarioRestriccion.data,
        null,
        'Registro Existoso',
      );
    } catch (e) {
      return this._respuestaService.respuestaHttp(false, null, null, null);
    }
  }
  convertirADTO<T, U>(objeto: T): U {
    const dto = {} as U;
    Object.keys(objeto).forEach((key) => {
      (dto as any)[key] = objeto[key];
    });
    return dto;
  }

  async updateAutUsuarioRestriccionPerfiles(
    idUsuarioRestriccion: number,
    dto: UpdateUsuarioRestriccionIdPerfilesDto,
  ) {
    try {
      const { colIdPerfiles, ...rest } = dto;
      const conversion = this.convertirADTO<
        typeof rest,
        CreateAutUsuarioRestriccionDto
      >(rest);
      const _restriccionPerfiles = new CreateAutUsuarioRestriccionPerfil();
      const creacionUsuarioRestriccion = await this.updateUsuarioRestriccion(
        idUsuarioRestriccion,
        conversion,
      );
      _restriccionPerfiles.idUsuarioRestriccion =
        creacionUsuarioRestriccion.data.idUsuarioRestriccion;
      const eliminarAutUsuarioRestriccionPerfil =
        this._autUsarioRestriccionPerfilService.deleteAllUsuarioRestriccionPerfil(
          idUsuarioRestriccion,
        );

      for (let i = 0; i < colIdPerfiles.length; i++) {
        _restriccionPerfiles.idPerfil = colIdPerfiles[i];
        await this._autUsarioRestriccionPerfilService.createRestriccionPerfilOne(
          _restriccionPerfiles,
        );
      }
      return this._respuestaService.respuestaHttp(
        true,
        creacionUsuarioRestriccion.data,
        null,
        'Modificacion Existosa',
      );
    } catch (e) {
      return this._respuestaService.respuestaHttp(false, null, null, null);
    }
  }

  //TODO:Retorna las restricciones de un usuario
  async listarRestriccionesFindUsuario(usuario: string) {
    const ruta = this._main + '/ listarRestriccionesFindUsuario';
    try {
      const resultado =
        await this._autUsarioRestriccionRepository.listarRestriccionesFindUsuario(
          usuario,
        );
      if (!resultado) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'No registra restricciones',
        );
      }
      return this._respuestaService.respuestaHttp(
        true,
        transformaCamelCaseArrayObjeto(resultado),
        ruta,
        'Listado de Restricciones',
      );
    } catch (e) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Contactese con el administrador ${e.message}`,
      );
    }
  }

  async deleteUsuarioRestriccion(
    idUsuarioRestriccion: number,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteUsuarioRestriccion';
    try {
      const restriccionUsuario = await this._autUsuarioRestriccion.findOneBy({
        idUsuarioRestriccion: idUsuarioRestriccion,
      });

      if (!restriccionUsuario)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      /*Si solo cuenta con una restriccion no se podra eliminar ya que es un requisito contar con una restriccion*/
      const cantidadRestricciones = await this._autUsuarioRestriccion.countBy({
        usuario: restriccionUsuario.usuario,
      });
      if(cantidadRestricciones == 1){
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error no se puede eliminar la única restricción asignada al usuario ' + restriccionUsuario.usuario,
        );
      }
      
      const updateConsolidado = await this._autUsuarioRestriccion.delete(
        idUsuarioRestriccion,
      );

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      return this._respuestaService.respuestaHttp(
        true,
        idUsuarioRestriccion,
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
