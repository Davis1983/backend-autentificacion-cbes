import { InjectRepository } from '@nestjs/typeorm';
import { ParInstitucion } from '../../core/domains/entities/par-institucion.entity';
import { Repository } from 'typeorm';
import { RespuestaService } from '../../../shared/services/respuesta.service';
import { PaginationDto } from '../../../../core/domain/dtos/pagination.dto';
import { RespuestaM } from '../../../../core/domain/models/respuesta.model';
import { ParSistema } from '../../core/domains/entities/par-sistema.entity';
import { Injectable } from '@nestjs/common';
import { formatoFecha } from '../../../../common/utility/all.utill';
import {
  CreateParInstitucionDto,
  UpdateParInstitucionDto,
} from '../../core/domains/dtos/par-institucion.dto';
import { ParGrupoInstitucionService } from './par-grupo-institucion.service';
import { UpdateParClasificadorDetalleDto } from '../../core/domains/dtos/par-clasificador-detalle.dto';
import { UpdateParSistemaDto } from '../../core/domains/dtos/par-sistema.dto';

@Injectable()
export class ParInstitucionService {
  _main = 'ParInstitucionService';
  constructor(
    @InjectRepository(ParInstitucion)
    private _parInstitucion: Repository<ParInstitucion>,
    //private _parGrupoInstitucionService: ParGrupoInstitucionService,
    private _respuestaService: RespuestaService,
  ) {}

  async findAllParInstitucion(
    paginadorDto: PaginationDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + ' /findAllParInstitucion';

    let data = null;
    try {
      if (paginadorDto.limit > 0) {
        data = await this._parInstitucion.find({
          select: {
            idInstitucion: true,
            //idGrupoInstitucion: true,
            nombreInstitucion: true,
            siglaInstitucion: true,
            descripcionInstitucion: true,
            fechaRegistro: true,
          },
          take: paginadorDto.limit,
          skip: paginadorDto.offset,
          order: {
            idInstitucion: 'DESC',
          },
          where: {
            bajaLogicaRegistro: false,
          },
        });
      } else {
        data = await this._parInstitucion.find({
          select: {
            idInstitucion: true,
            //idGrupoInstitucion: true,
            nombreInstitucion: true,
            siglaInstitucion: true,
            descripcionInstitucion: true,
            fechaRegistro: true,
          },
          order: {
            idInstitucion: 'DESC',
          },
          where: {
            bajaLogicaRegistro: false,
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
          'correcto',
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

  async createParInstitucion(parInstitucion: CreateParInstitucionDto) {
    const ruta = this._main + ' /createParInstitucion';
    try {
      /*const parGrupoInstitucion =
        await this._parGrupoInstitucionService.findOne(
          parInstitucion.idGrupoInstitucion,
        );
      const { data } = parGrupoInstitucion;
      if (!data)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'No existe el Grupo Institucion',
        );*/
      const newParInstitucion = await this._parInstitucion.create(
        parInstitucion,
      );
      const createParInstitucion = await this._parInstitucion.save(
        newParInstitucion,
      );
      if (createParInstitucion) {
        const resp = {
          idInstitucion: createParInstitucion.idInstitucion,
          //idGrupoInstitucion: createParInstitucion.idGrupoInstitucion,
          nombreInstitucion: createParInstitucion.nombreInstitucion,
          siglaInstitucion: createParInstitucion.siglaInstitucion,
        };
        return this._respuestaService.respuestaHttp(
          true,
          resp,
          ruta,
          'Registro Exitoso',
        );
      } else {
        return this._respuestaService.respuestaHttp(
          false,
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

  async finByIdParInstitucion(id: number) {
    const ruta = this._main + ' /finByIdParInstitucion';
    let parInstitucion = null;
    try {
      parInstitucion = await this._parInstitucion.findOne({
        select: {
          idInstitucion: true,
          //idGrupoInstitucion: true,
          nombreInstitucion: true,
          siglaInstitucion: true,
          fechaRegistro: true,
        },
        where: {
          idInstitucion: id,
          bajaLogicaRegistro: false,
        },
      });
      if (parInstitucion) {
        parInstitucion.fechaRegistro = formatoFecha(
          parInstitucion.fechaRegistro,
        );
        return this._respuestaService.respuestaHttp(
          true,
          parInstitucion,
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

  async finByIdParGrupoInstitucion(idGrupoInstitucion: number) {
    const ruta = this._main + ' /finByIdParInstitucion';
    let parInstitucion = null;
    try {
      parInstitucion = await this._parInstitucion.findOne({
        select: {
          idInstitucion: true,
          //idGrupoInstitucion: true,
          nombreInstitucion: true,
          siglaInstitucion: true,
          fechaRegistro: true,
        },
        where: {
          //idGrupoInstitucion: idGrupoInstitucion,
          bajaLogicaRegistro: false,
        },
      });
      if (parInstitucion) {
        parInstitucion.fechaRegistro = formatoFecha(
          parInstitucion.fechaRegistro,
        );
        return this._respuestaService.respuestaHttp(
          true,
          parInstitucion,
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
  async updateParInstitucion(
    idParInstitucion: number,
    updateParInstitucion: UpdateParInstitucionDto,
  ) {
    const ruta = this._main + '/ updateParInstitucion';
    try {
      const respParInstitucion = await this._parInstitucion.findOneBy({
        idInstitucion: idParInstitucion,
      });
      if (!respParInstitucion)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      /*const { data } = await this._parGrupoInstitucionService.findOne(
        updateParInstitucion.idGrupoInstitucion,
      );
      if (!data)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro Par Clasificador no Encontrado',
        );
      this._parInstitucion.merge(respParInstitucion, updateParInstitucion);*/

      const updateConsolidado = await this._parInstitucion.save(
        respParInstitucion,
      );
      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idInstitucion: updateConsolidado.idInstitucion,
        //idGrupoInstitucion: updateConsolidado.idGrupoInstitucion,
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

  async deleteLogicoParInstitucion(
    idParInstitucion: number,
    usuario: string,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteLogicoParInstitucion';
    const updateParInstitucion = new UpdateParInstitucionDto();

    try {
      const parInstitucion = await this._parInstitucion.findOneBy({
        idInstitucion: idParInstitucion,
      });

      if (!parInstitucion)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      updateParInstitucion.bajaLogicaRegistro = true;
      updateParInstitucion.usuarioModificacion = usuario;
      this._parInstitucion.merge(parInstitucion, updateParInstitucion);

      const updateConsolidado = await this._parInstitucion.save(parInstitucion);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idInstitucion: updateConsolidado.idInstitucion,
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

  async deleteParInstitucion(idParInstitucion: number): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteParInstitucion';
    return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        "Temporalmente Inactivo",
    );
    try {
      const parInstitucion = await this._parInstitucion.findOneBy({
        idInstitucion: idParInstitucion,
      });

      if (!parInstitucion)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      const updateConsolidado = await this._parInstitucion.delete(
        idParInstitucion,
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
        idParInstitucion,
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
