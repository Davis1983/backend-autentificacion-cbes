import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'pg';
import { AutRecursoRepository } from '../../repositories/impl/aut-recurso.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AutRecurso } from '../../core/domains/entities';
import { Repository } from 'typeorm';
import { RespuestaM } from '../../../../core/domain/models/respuesta.model';
import { formatoFecha } from '../../../../common/utility/all.utill';
import { RespuestaConsultaEnum } from '../../../../core/enum/respuesta-consulta.enum';
import { RespuestaService } from '../../../shared/services/respuesta.service';
import { AutRecursoMapper_EntitiesToDtos } from '../../mapper/aut-recurso.mapper';
import {
  CreateAutRecursoDto,
  UpdateAutRecursoDto,
} from '../../core/domains/dtos/aut-recurso.dto';
import { map } from 'rxjs/operators';
import {
  ParSistemaService,
  ParTipoRecursoService,
} from '../../../parametros/services/impl';
import { UpdateParClasificadorDetalleDto } from '../../../parametros/core/domains/dtos/par-clasificador-detalle.dto';

@Injectable()
export class AutRecursoService {
  _autRecursoRepository: AutRecursoRepository;
  _main = 'AutRecursoService';
  private logger = new Logger('AutRecursoService');
  constructor(
    @Inject('PG') private _client: Client,
    @InjectRepository(AutRecurso)
    private _autRecurso: Repository<AutRecurso>,
    private _respuestaService: RespuestaService,
    private _parSistemaService: ParSistemaService,
    private _parTipoRecurso: ParTipoRecursoService,
  ) {
    this._autRecursoRepository = new AutRecursoRepository(_client);
  }

  async findByAutRecursoByIdTipoRecurso(
    idTipoRecurso: number,
  ): Promise<RespuestaM> {
    const ruta = this._main + ' /findByAutRecursoByIdTipoRecurso';
    let autRecurso = null;
    try {
      autRecurso = await this._autRecurso.find({
        select: {
          idRecurso: true,
          idSistema: true,
          idTipoRecurso: true,
          uri: true,
          nombreRecurso: true,
        },
        where: {
          idTipoRecurso: idTipoRecurso,
          idRecursoSuperior: null,
        },
      });
      if (autRecurso) {
        autRecurso.fechaRegistro = formatoFecha(autRecurso.fechaRegistro);
        return this._respuestaService.respuestaHttp(
          true,
          autRecurso,
          ruta,
          RespuestaConsultaEnum.LISTADO_EXITOSO,
        );
      } else {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          RespuestaConsultaEnum.SIN_REGISTRO,
        );
      }
    } catch (error) {
      this.logger.error(error);
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${error.code}`,
      );
    }
  }

  async listarHijosAutRecursoByIdPadre(idRecurso: number) {
    const ruta = this._main + ' / listarHijosAutRecursoByIdPadre';
    const resp =
      await this._autRecursoRepository.listarHijosAutRecursoByIdPadre(
        idRecurso,
      );
    console.log(resp);
    const data = AutRecursoMapper_EntitiesToDtos(resp);
    return this._respuestaService.respuestaHttp(
      true,
      data,
      ruta,
      RespuestaConsultaEnum.LISTADO_EXITOSO,
    );
  }

  async findByAutRecursoByIdTipoSistema(
    idTipoSistema: number,
  ): Promise<RespuestaM> {
    const ruta = this._main + ' /findByAutRecursoByIdTipoSistema';
    let autRecurso = null;
    try {
      autRecurso = await this._autRecurso.find({
        select: {
          idRecurso: true,
          idSistema: true,
          idTipoRecurso: true,
          uri: true,
          nombreRecurso: true,
        },
        where: {
          idSistema: idTipoSistema,
          idRecursoSuperior: null,
        },
      });
      if (autRecurso) {
        autRecurso.fechaRegistro = formatoFecha(autRecurso.fechaRegistro);
        return this._respuestaService.respuestaHttp(
          true,
          autRecurso,
          ruta,
          RespuestaConsultaEnum.LISTADO_EXITOSO,
        );
      } else {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          RespuestaConsultaEnum.SIN_REGISTRO,
        );
      }
    } catch (error) {
      this.logger.error(error);
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${error.code}`,
      );
    }
  }

  async findAllGestionRecursoBySistema(idsistema: number) {
    try {
      let idPadres = null;
      const resultado = [];
      if (idsistema === 0) {
        idPadres =
          await this._autRecursoRepository.obtenerTodosPadresSuperioresAutRecurso();
      } else {
        const valorIdSistema = await this._parSistemaService.findByIdSistema(
          idsistema,
        );
        if (!valorIdSistema.data) {
          return this._respuestaService.respuestaHttp(
            false,
            null,
            null,
            `No Existe el ID Sistema`,
          );
        }
        idPadres =
          await this._autRecursoRepository.obtenerPadresSuperioresAutRecurso(
            idsistema,
          );
      }

      for (let i = 0; i < idPadres.length; i++) {
        resultado.push(
          await this._autRecursoRepository.listarHijosAutRecursoByIdPadreIncluidoPadre(
            idPadres[i].id_recurso,
          ),
        );
      }
      const resp = [];
      resultado.map((datos, index) => {
        datos.map((data) => {
          resp.push(data);
        });
      });
      let valores = null;
      valores = AutRecursoMapper_EntitiesToDtos(resp);
      let nombrePadre = null;
      let nombreTipoRecurso = null;
      for (let i = 0; i < valores.length; i++) {
        if (!valores[i].idRecursoSuperior) {
          valores[i].nombreRecursoPadre = 'Recurso Padre';
          nombreTipoRecurso =
            await this._autRecursoRepository.obtenerNombreTipoRecurso(
              valores[i].idTipoRecurso,
            );
          valores[i].nombreTipoRecurso = nombreTipoRecurso.nombre_tipo_recurso;
        } else {
          nombreTipoRecurso =
            await this._autRecursoRepository.obtenerNombreTipoRecurso(
              valores[i].idTipoRecurso,
            );
          valores[i].nombreTipoRecurso = nombreTipoRecurso.nombre_tipo_recurso;
          nombrePadre = await this._autRecursoRepository.obtenerNombreDelPadre(
            valores[i].idRecursoSuperior,
          );
          valores[i].nombreRecursoPadre = nombrePadre.nombre_recurso;
        }
      }
      return this._respuestaService.respuestaHttp(true, valores, null, 'exito');
    } catch (e) {
      return null;
    }
  }

  async findOneByIdRecurso(idRecurso: number) {
    const ruta = this._main + ' /findOneByIdRecurso';
    let autRecurso = null;
    try {
      autRecurso = await this._autRecurso.findOne({
        select: {
          idRecurso: true,
          idSistema: true,
          idRecursoSuperior: true,
          nombreRecurso: true,
          orden: true,
          fechaRegistro: true,
        },
        where: {
          idRecurso: idRecurso,
        },
      });
      if (autRecurso) {
        autRecurso.fechaRegistro = formatoFecha(autRecurso.fechaRegistro);

        return this._respuestaService.respuestaHttp(
          true,
          autRecurso,
          null,
          'Correcto',
        );
      } else {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Datos no encontrados',
        );
      }
    } catch (error) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error 500 ${error.message}`,
      );
    }
  }

  async createAutRecurso(autRecursoDto: CreateAutRecursoDto) {
    const ruta = this._main + '/ createAutRecurso';
    try {
      const parSistema = await this._parSistemaService.findByIdSistema(
        autRecursoDto.idSistema,
      );
      if (!parSistema.data) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'el id sistema no existe',
        );
      }
      if (autRecursoDto.idRecursoSuperior > 0) {
        const validar = await this.findOneByIdRecurso(
          autRecursoDto.idRecursoSuperior,
        );
        if (!validar.data) {
          return this._respuestaService.respuestaHttp(
            false,
            null,
            ruta,
            'el id recurso superior no existe',
          );
        }
      }else{
        delete autRecursoDto.idRecursoSuperior;
      }
      const parTipoRecurso = await this._parTipoRecurso.findOne(
        autRecursoDto.idTipoRecurso,
      );
      if (!parTipoRecurso.data) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'el id tipo recurso no existe',
        );
      }
      const newAutRecurso = this._autRecurso.create(autRecursoDto);
      const autRecurso = await this._autRecurso.save(newAutRecurso);
      if (autRecurso) {
        const resp = {
          idRecurso: autRecurso.idRecurso,
          idRecuroSuperior: autRecurso.idRecursoSuperior,
          nombreRecurso: autRecurso.nombreRecurso,
        };
        return this._respuestaService.respuestaHttp(
          true,
          resp,
          ruta,
          'Registro Exitoso',
        );
      }
    } catch (error) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error en el Registro ${error.message}`,
      );
    }
  }
  async updateAutRecurso(
    idAutRecurso: number,
    updateAutRecurso: UpdateAutRecursoDto,
  ) {
    const ruta = this._main + '/ updateAutRecurso';
    try {
      const respAutRecurso = await this._autRecurso.findOneBy({
        idRecurso: idAutRecurso,
      });
      if (!respAutRecurso)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      const parSistema = await this._parSistemaService.findByIdSistema(
        updateAutRecurso.idSistema,
      );
      if (!parSistema.data) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'el id sistema no existe',
        );
      }
      if (updateAutRecurso.idRecursoSuperior > 0) {
        const validar = await this.findOneByIdRecurso(
          updateAutRecurso.idRecursoSuperior,
        );
        if (!validar.data) {
          return this._respuestaService.respuestaHttp(
            false,
            null,
            ruta,
            'el id recurso superior no existe',
          );
        }
      }
      const parTipoRecurso = await this._parTipoRecurso.findOne(
        updateAutRecurso.idTipoRecurso,
      );
      if (!parTipoRecurso.data) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'el id tipo recurso no existe',
        );
      }
      this._autRecurso.merge(respAutRecurso, updateAutRecurso);

      const updateConsolidado = await this._autRecurso.save(respAutRecurso);
      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idRecurso: updateConsolidado.idRecurso,
        nombreRecurso: updateConsolidado.nombreRecurso,
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

  async deleteLogicoAutRecurso(
    idAutRecurso: number,
    usuario: string,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteLogicoParClasificadorDetalle';
    const updateAutRecurso = new UpdateAutRecursoDto();

    try {
      const autRecurso = await this._autRecurso.findOneBy({
        idRecurso: idAutRecurso,
      });

      if (!autRecurso)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      autRecurso.bajaLogicaRegistro = true;
      autRecurso.usuarioModificacion = usuario;
      this._autRecurso.merge(autRecurso, updateAutRecurso);

      const updateConsolidado = await this._autRecurso.save(autRecurso);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idRecurso: updateConsolidado.idRecurso,
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

  async deleteAutRecurso(idAutRecurso: number): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteAutRecurso';

    try {
      const autRecurso = await this._autRecurso.findOneBy({
        idRecurso: idAutRecurso,
      });

      if (!autRecurso)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      const updateConsolidado = await this._autRecurso.delete(idAutRecurso);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      return this._respuestaService.respuestaHttp(
        true,
        idAutRecurso,
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
