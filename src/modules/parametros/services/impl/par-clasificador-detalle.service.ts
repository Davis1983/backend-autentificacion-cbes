import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParClasificadorDetalle } from '../../core/domains/entities/par-clasificador-detalle.entity';
import { PaginationDto } from '../../../../core/domain/dtos/pagination.dto';
import { RespuestaM } from '../../../../core/domain/models/respuesta.model';
import { RespuestaService } from '../../../shared/services/respuesta.service';
import { Injectable } from '@nestjs/common';
import {
  CreateParClasificadorDetalleDto,
  UpdateParClasificadorDetalleDto,
} from '../../core/domains/dtos/par-clasificador-detalle.dto';
import { ParClasificadorService } from './par-clasificador.service';
import { formatoFecha } from '../../../../common/utility/all.utill';
import { ParClasificadorDetalleInterface } from '../par-clasificador-detalle.interface';

@Injectable()
export class ParClasificadorDetalleService
  implements ParClasificadorDetalleInterface
{
  _main = 'ParClasificadorDetalleService';
  constructor(
    @InjectRepository(ParClasificadorDetalle)
    private _parClasificadorDetalle: Repository<ParClasificadorDetalle>,
    private _parClasificadorService: ParClasificadorService,
    private _respuestaService: RespuestaService,
  ) {}

  async findAllParClasificadorDetalle(
    paginadorDto: PaginationDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + ' /findAllParClasificadorDetalle';
    const { limit = 10, offset = 0 } = paginadorDto;
    let data = null;
    data = await this._parClasificadorDetalle.find({
      select: {
        idClasificadorDetalle: true,
        identificadorClasificador: true,
        nombreClasificadorDetalle: true,
        descripcionClasificadorDetalle: true,
        orden: true,
        fechaRegistro: true,
      },
      take: limit,
      skip: offset,
      order: {
        idClasificadorDetalle: 'desc',
      },
    });

    if (data) {
      data.map((datos) => {
        datos.fechaRegistro = formatoFecha(datos.fechaRegistro);
      });
      return this._respuestaService.respuestaHttp(true, data, ruta, 'correcto');
    }

    return this._respuestaService.respuestaHttp(true, data, ruta);
  }

  async createParClasificadorDetalle(
    parClasificadorDetalleDto: CreateParClasificadorDetalleDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + ' /createParClasificadorDetalle';
    try {
      const parClasificador =
        await this._parClasificadorService.findOneIdentificadorClasificador(
          parClasificadorDetalleDto.identificadorClasificador,
        );
      const { data } = parClasificador;
      //const { datos } = parClasificador;
      if (!data)
        //if (!datos)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'No existe el Identificador clasificador',
        );
      const newParClasificadorDetalle =
        await this._parClasificadorDetalle.create(parClasificadorDetalleDto);
      const createParClasificadorDetalle =
        await this._parClasificadorDetalle.save(newParClasificadorDetalle);
      if (createParClasificadorDetalle) {
        const resp = {
          idClasificadorDetalle:
            createParClasificadorDetalle.idClasificadorDetalle,
          identificadorClasificador:
            createParClasificadorDetalle.identificadorClasificador,
          nombreClasificadorDetalle:
            createParClasificadorDetalle.nombreClasificadorDetalle,
        };
        return this._respuestaService.respuestaHttp(
          true,
          resp,
          ruta,
          'Registro Exitoso',
        );
      } else {
        return this._respuestaService.respuestaHttp(
          true,
          null,
          ruta,
          'Error en el Registro',
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

  async findByIdParClasificadorDetalle(
    idClasificadorDetalle: number,
  ): Promise<RespuestaM> {
    const ruta = this._main + ' /findByIdParClasificadorDetalle';
    let clasificadorDetalle = null;
    try {
      clasificadorDetalle = await this._parClasificadorDetalle.findOne({
        select: {
          idClasificadorDetalle: true,
          identificadorClasificador: true,
          nombreClasificadorDetalle: true,
          descripcionClasificadorDetalle: true,
          orden: true,
          fechaRegistro: true,
        },
        where: {
          idClasificadorDetalle: idClasificadorDetalle,
        },
      });
      if (clasificadorDetalle) {
        clasificadorDetalle.fechaRegistro = formatoFecha(
          clasificadorDetalle.fechaRegistro,
        );

        return this._respuestaService.respuestaHttp(
          true,
          clasificadorDetalle,
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

  async findByIdentificadorClasificador(
    identificadorClasificador: string,
  ): Promise<RespuestaM> {
    const ruta = this._main + ' /findByIdParClasificadorDetalle';
    let clasificadorDetalle = null;
    try {
      clasificadorDetalle = await this._parClasificadorDetalle.find({
        select: {
          idClasificadorDetalle: true,
          identificadorClasificadorDetalle: true,
          identificadorClasificador: true,
          nombreClasificadorDetalle: true,
          descripcionClasificadorDetalle: true,
          orden: true,
          fechaRegistro: true,
        },
        where: {
          identificadorClasificador: identificadorClasificador,
        },
        order: {
          orden: 'asc',
        },
      });
      if (clasificadorDetalle) {
        clasificadorDetalle.map((datos) => {
          datos.fechaRegistro = formatoFecha(clasificadorDetalle.fechaRegistro);
        });

        return this._respuestaService.respuestaHttp(
          true,
          clasificadorDetalle,
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

  async updateParClasificadorDetalle(
    idClasificadorDetalle: number,
    updateParClasificadorDetalle: UpdateParClasificadorDetalleDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ updateParClasificadorDetalle';
    try {
      const respParClasificadorDetalle =
        await this._parClasificadorDetalle.findOneBy({
          idClasificadorDetalle: idClasificadorDetalle,
        });
      if (!respParClasificadorDetalle)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      const { data } =
        await this._parClasificadorService.findOneIdentificadorClasificador(
          updateParClasificadorDetalle.identificadorClasificador,
        );
      if (!data)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro Par Clasificador no Encontrado',
        );
      this._parClasificadorDetalle.merge(
        respParClasificadorDetalle,
        updateParClasificadorDetalle,
      );

      const updateConsolidado = await this._parClasificadorDetalle.save(
        respParClasificadorDetalle,
      );
      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idClasificadorDetalle: updateConsolidado.idClasificadorDetalle,
        identificadorClasificador: updateConsolidado.identificadorClasificador,
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

  async deleteLogicoParClasificadorDetalle(
    idClasificadorDetalle: number,
    usuario: string,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteLogicoParClasificadorDetalle';
    const updateParClasificadorDetalle = new UpdateParClasificadorDetalleDto();

    try {
      const clasificadorDet = await this._parClasificadorDetalle.findOneBy({
        idClasificadorDetalle: idClasificadorDetalle,
      });

      if (!clasificadorDet)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      updateParClasificadorDetalle.bajaLogicaRegistro = true;
      updateParClasificadorDetalle.usuarioModificacion = usuario;
      this._parClasificadorDetalle.merge(
        clasificadorDet,
        updateParClasificadorDetalle,
      );

      const updateConsolidado = await this._parClasificadorDetalle.save(
        clasificadorDet,
      );

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idClasificadorDetalle: updateConsolidado.idClasificadorDetalle,
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

  async deleteParClasificadorDetalle(
    idClasificadorDetalle: number,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteParClasificadorDetalle';
    try {
      const clasificadorDet = await this._parClasificadorDetalle.findOneBy({
        idClasificadorDetalle: idClasificadorDetalle,
      });

      if (!clasificadorDet)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      const updateConsolidado = await this._parClasificadorDetalle.delete(
        idClasificadorDetalle,
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
        idClasificadorDetalle,
        ruta,
        'Eliminacion Correcta',
      );
    } catch (error) {
      if(error.code == 23503){
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          `El SubClasificador cuenta con registros asignados, no se puede eliminar!!!`,
        );
      }
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${error.message}`,
      );
    }
  }
}
