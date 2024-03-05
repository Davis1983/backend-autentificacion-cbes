import { InjectRepository } from '@nestjs/typeorm';
import { ParClasificadorServiceInterface } from '../par-clasificador.interface';
import { ParClasificador } from '../../core/domains/entities/par-clasificador.entity';
import { LessThan, Raw, Repository } from 'typeorm';
import {
  CreateParClasificadorDto,
  UpdateParClasificadorDto,
} from '../../core/domains/dtos/par-clasificador.dto';
import { RespuestaM } from 'src/core/domain/models/respuesta.model';
import { RespuestaService } from 'src/modules/shared/services/respuesta.service';
import { PaginationDto } from '../../../../core/domain/dtos/pagination.dto';
import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { formatoFecha } from '../../../../common/utility/all.utill';
import { RespuestaConsultaEnum } from '../../../../core/enum/respuesta-consulta.enum';

@Injectable()
export class ParClasificadorService implements ParClasificadorServiceInterface {
  private logger = new Logger('ParClasificadorService');
  _main = 'ParClasificadorService';
  constructor(
    @InjectRepository(ParClasificador)
    private _parClasificador: Repository<ParClasificador>,
    private _respuestaService: RespuestaService,
  ) {}

  /**
   * Lista los Registros si no se recibe un limit se genera una lista total
   * @param paginadorDto
   */
  async findAllParClasificador(
    paginadorDto: PaginationDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ findAllParClasificador';

    let data = null;
    try {
      if (paginadorDto.limit > 0) {
        data = await this._parClasificador.find({
          select: {
            idClasificador: true,
            identificadorClasificador: true,
            descripcionClasificador: true,
            fechaRegistro: true,
          },
          where: {
            bajaLogicaRegistro: false,
          },
          take: paginadorDto.limit,
          skip: paginadorDto.offset,
          order: {
            idClasificador: 'asc',
          },
        });
      } else {
        data = await this._parClasificador.find({
          select: {
            idClasificador: true,
            identificadorClasificador: true,
            descripcionClasificador: true,
            fechaRegistro: true,
          },
          where: {
            bajaLogicaRegistro: false,
          },
          order: {
            idClasificador: 'asc',
          },
        });
      }
      if (data) {
        data.map((datos) => {
          datos.fechaRegistro = formatoFecha(datos.fechaRegistro);
        });
        return this._respuestaService.respuestaHttp(
          true,
          data,
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
    } catch (e) {
      this.logger.error(e);
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        RespuestaConsultaEnum.ERROR_EN_SERVIDOR,
      );
    }
  }

  /**
   *Lista un Registro de clasificador por su ID
   * @param id
   */
  async findOne(id: number): Promise<RespuestaM> {
    const ruta = this._main + '/ findOne';
    let clasificador = null;
    try {
      clasificador = await this._parClasificador.findOne({
        select: {
          idClasificador: true,
          identificadorClasificador: true,
          descripcionClasificador: true,
          fechaRegistro: true,
        },
        where: {
          idClasificador: id,
          bajaLogicaRegistro: false,
        },
      });
      if (clasificador) {
        clasificador.fechaRegistro = formatoFecha(clasificador.fechaRegistro);
        return this._respuestaService.respuestaHttp(
          true,
          clasificador,
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
    } catch (e) {
      this.logger.error(e);
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${e.code}`,
      );
    }
  }

  /**
   * Realiza la busqueda con el literal identificador clasificador
   * @param identificadorClasificador
   */
  async findOneIdentificadorClasificador(
    identificadorClasificador: string,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ findOneIdentificadorClasificador';
    let clasificador = null;
    try {
      clasificador = await this._parClasificador.findOne({
        select: {
          idClasificador: true,
          identificadorClasificador: true,
          descripcionClasificador: true,
          fechaRegistro: true,
        },
        where: {
          identificadorClasificador: identificadorClasificador,
          bajaLogicaRegistro: false,
        },
      });
      if (clasificador) {
        clasificador.fechaRegistro = formatoFecha(clasificador.fechaRegistro);
        return this._respuestaService.respuestaHttp(
          true,
          clasificador,
          ruta,
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
        `Error ${error.message}`,
      );
    }
  }

  async createParClasificador(
    data: CreateParClasificadorDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ createParClasificador';
    try {
      const newClasificador = this._parClasificador.create(data);
      const clasificador = await this._parClasificador.save(newClasificador);
      if (clasificador) {
        const resp = {
          idClasificador: clasificador.idClasificador,
          identificadorClasificador: clasificador.identificadorClasificador,
          descripcionClasificador: clasificador.descripcionClasificador,
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
        true,
        null,
        ruta,
        `Error en el Registro ${error.message}`,
      );
    }
  }

  async updateParClasificador(
    idClasificador: number,
    updateParClasificador: UpdateParClasificadorDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ updateParClasificador';
    try {
      const clasificador = await this._parClasificador.findOneBy({
        idClasificador: idClasificador,
      });
      if (!clasificador)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      this._parClasificador.merge(clasificador, updateParClasificador);

      const updateConsolidado = await this._parClasificador.save(clasificador);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idClasificador: updateConsolidado.idClasificador,
        identificadorClasificador: updateConsolidado.identificadorClasificador,
        descripcionClasificador: updateParClasificador.descripcionClasificador,
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

  async deleteLogicoParClasificador(
    idClasificador: number,
    usuario: string,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteLogicoParClasificador';
    const updateParClasificador = new UpdateParClasificadorDto();

    try {
      const clasificador = await this._parClasificador.findOneBy({
        idClasificador: idClasificador,
      });

      if (!clasificador)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      updateParClasificador.bajaLogicaRegistro = true;
      updateParClasificador.usuarioModificacion = usuario;
      this._parClasificador.merge(clasificador, updateParClasificador);

      const updateConsolidado = await this._parClasificador.save(clasificador);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        identificadorClasificador: updateConsolidado.identificadorClasificador,
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

  async deleteParClasificador(idClasificador: number): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteParClasificador';
    try {
      const clasificador = await this._parClasificador.findOneBy({
        idClasificador: idClasificador,
      });

      if (!clasificador)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          RespuestaConsultaEnum.SIN_REGISTRO,
        );
      const updateConsolidado = await this._parClasificador.delete(
        idClasificador,
      );

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          RespuestaConsultaEnum.ERROR_EN_EL_REGISTRO,
        );

      return this._respuestaService.respuestaHttp(
        true,
        idClasificador,
        ruta,
        RespuestaConsultaEnum.ELIMINACION_CORRECTA,
      );
    } catch (error) {
      this.logger.error(error);
      if(error.code == 23503){
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          `El Clasificador cuenta con subclasificadores, no se puede eliminar!!!`,
        );
      }
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${error}' codigo de error: '${error.code}`,
      );
    }
  }
}
