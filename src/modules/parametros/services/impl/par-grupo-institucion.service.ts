import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParGrupoInstitucion } from '../../core/domains/entities/par-grupo-institucion.entity';
import { Repository } from 'typeorm';
import { RespuestaService } from '../../../shared/services/respuesta.service';
import { PaginationDto } from '../../../../core/domain/dtos/pagination.dto';
import { RespuestaM } from '../../../../core/domain/models/respuesta.model';
import {
  CreateParGrupoInstitucion,
  UpdateParGrupoInstitucionDto,
} from '../../core/domains/dtos/par-grupo-institucion.dto';
import { formatoFecha } from '../../../../common/utility/all.utill';
import { UpdateParClasificadorDto } from '../../core/domains/dtos/par-clasificador.dto';

@Injectable()
export class ParGrupoInstitucionService {
  _main = 'ParGrupoInstitucionService';
  constructor(
    @InjectRepository(ParGrupoInstitucion)
    private _parGrupoInstitucion: Repository<ParGrupoInstitucion>,
    private _respuestaService: RespuestaService,
  ) {}

  async findAllParGrupoInstitucionService(
    paginadorDto: PaginationDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + ' /findAllParGrupoInstitucionService';
    let data = null;
    try {
      if (paginadorDto.limit > 0) {
        data = await this._parGrupoInstitucion.find({
          select: {
            idGrupoInstitucion: true,
            nombreGrupoInstitucion: true,
            fechaRegistro: true,
          },
          take: paginadorDto.limit,
          skip: paginadorDto.offset,
          order: {
            idGrupoInstitucion: 'DESC',
          },
          where: {
            bajaLogicaRegistro: false,
          },
        });
      } else {
        data = await this._parGrupoInstitucion.find({
          select: {
            idGrupoInstitucion: true,
            nombreGrupoInstitucion: true,
            fechaRegistro: true,
          },
          order: {
            idGrupoInstitucion: 'DESC',
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
          'Correcto',
        );
      } else {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'No se encontraron registros',
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

  async findOne(id: number): Promise<RespuestaM> {
    const ruta = this._main + '/ findOne';
    let grupoInstitucion = null;
    try {
      grupoInstitucion = await this._parGrupoInstitucion.findOne({
        select: {
          idGrupoInstitucion: true,
          nombreGrupoInstitucion: true,
          fechaRegistro: true,
        },
        where: {
          idGrupoInstitucion: id,
          bajaLogicaRegistro: false,
        },
      });
      if (grupoInstitucion) {
        grupoInstitucion.fechaRegistro = formatoFecha(
          grupoInstitucion.fechaRegistro,
        );
        return this._respuestaService.respuestaHttp(
          true,
          grupoInstitucion,
          ruta,
          'Correcto',
        );
      } else {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'No se encontraron Registros',
        );
      }
    } catch (e) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error 500 ${e.message}`,
      );
    }
  }

  async createParGrupoInstitucion(
    parGrupoInstitucion: CreateParGrupoInstitucion,
  ) {
    const ruta = this._main + '/ createParGrupoInstitucion';
    try {
      const newParGrupoInstitucion =
        this._parGrupoInstitucion.create(parGrupoInstitucion);
      const consolidadoParGrupo = await this._parGrupoInstitucion.save(
        newParGrupoInstitucion,
      );
      if (consolidadoParGrupo) {
        const resp = {
          idGrupoInstitucion: consolidadoParGrupo.idGrupoInstitucion,
          nombreGrupoInstitucion: consolidadoParGrupo.nombreGrupoInstitucion,
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

  async updateParGrupoInstitucion(
    idGrupoInstitucion: number,
    updateParGrupoInstitucion: UpdateParGrupoInstitucionDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ updateParGrupoInstitucion';
    try {
      const grupoInstitucion = await this._parGrupoInstitucion.findOneBy({
        idGrupoInstitucion: idGrupoInstitucion,
      });
      if (!grupoInstitucion)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      this._parGrupoInstitucion.merge(
        grupoInstitucion,
        updateParGrupoInstitucion,
      );

      const updateConsolidado = await this._parGrupoInstitucion.save(
        grupoInstitucion,
      );

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idGrupoInstitucion: updateConsolidado.idGrupoInstitucion,
        nombreGrupoInstitucion: updateConsolidado.nombreGrupoInstitucion,
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

  async deleteLogicoParGrupoInstitucion(
    idGrupoInstitucion: number,
    usuario: string,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteLogicoParGrupoInstitucion';
    const updateParGrupoInstitucion = new UpdateParGrupoInstitucionDto();

    try {
      const parGrupo = await this._parGrupoInstitucion.findOneBy({
        idGrupoInstitucion: idGrupoInstitucion,
      });

      if (!updateParGrupoInstitucion)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      updateParGrupoInstitucion.bajaLogicaRegistro = true;
      updateParGrupoInstitucion.usuarioModificacion = usuario;
      this._parGrupoInstitucion.merge(parGrupo, updateParGrupoInstitucion);

      const updateConsolidado = await this._parGrupoInstitucion.save(parGrupo);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idGrupoInstitucion: updateConsolidado.idGrupoInstitucion,
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

  async deleteParGrupoInstitucion(idGrupoIst: number): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteParGrupoInstitucion';
    return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        "Temporalmente Inactivo",
    );
    try {
      const institucion = await this._parGrupoInstitucion.findOneBy({
        idGrupoInstitucion: idGrupoIst,
      });

      if (!institucion)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      const updateConsolidado = await this._parGrupoInstitucion.delete(
        idGrupoIst,
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
        idGrupoIst,
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
