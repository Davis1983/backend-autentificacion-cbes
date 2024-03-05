import { InjectRepository } from '@nestjs/typeorm';
import { ParGrupoProfesionServiceInterface } from '../par-grupo-profesion.interface';
import { ParGrupoProfesion } from '../../core/domains/entities/par-grupo-profesion.entity';
import { Repository } from 'typeorm';
import {
  CreateParGrupoProfesionDto,
  UpdateParGrupoProfesionDto,
} from '../../core/domains/dtos/par-grupo-profesion.dto';
import { RespuestaM } from 'src/core/domain/models/respuesta.model';
import { RespuestaService } from 'src/modules/shared/services/respuesta.service';
import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../../../../core/domain/dtos/pagination.dto';
import { formatoFecha } from '../../../../common/utility/all.utill';
import { UpdateParGrupoInstitucionDto } from '../../core/domains/dtos/par-grupo-institucion.dto';

@Injectable()
export class ParGrupoProfesionService
  implements ParGrupoProfesionServiceInterface
{
  _main = 'ParGrupoProfesionService';
  constructor(
    @InjectRepository(ParGrupoProfesion)
    private _parGrupoProfesion: Repository<ParGrupoProfesion>,
    private _respuestaService: RespuestaService,
  ) {}

  async findAllGrupoProfesion(
    paginadorDto: PaginationDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + ' /findAllGrupoProfesion';

    let data = null;
    try {
      if (paginadorDto.limit > 0) {
        data = await this._parGrupoProfesion.find({
          select: {
            idGrupoProfesion: true,
            nombreGrupoProfesion: true,
            nombreDescripcionProfesion: true,
            tipoRegistro: true,
            fechaRegistro: true,
          },
          take: paginadorDto.limit,
          skip: paginadorDto.offset,
          order: {
            idGrupoProfesion: 'DESC',
          },
          where: {
            bajaLogicaRegistro: false,
          },
        });
      } else {
        data = await this._parGrupoProfesion.find({
          select: {
            idGrupoProfesion: true,
            nombreGrupoProfesion: true,
            nombreDescripcionProfesion: true,
            tipoRegistro: true,
            fechaRegistro: true,
          },
          order: {
            idGrupoProfesion: 'DESC',
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
      } else {
        return this._respuestaService.respuestaHttp(
          false,
          data,
          null,
          'no se encontraron registros',
        );
      }
    } catch (e) {
      console.log(e);
      return this._respuestaService.respuestaHttp(
        false,
        null,
        data,
        `Error ${e.message}`,
      );
    }
  }

  async findOne(id: number): Promise<RespuestaM> {
    const ruta = this._main + ' /findOne';
    let data = null;
    try {
      data = await this._parGrupoProfesion.findOne({
        select: {
          idGrupoProfesion: true,
          nombreGrupoProfesion: true,
          nombreDescripcionProfesion: true,
          tipoRegistro: true,
          fechaRegistro: true,
        },
        where: {
          idGrupoProfesion: id,
          bajaLogicaRegistro: false,
        },
      });
      if (data) {
        data.fechaRegistro = formatoFecha(data.fechaRegistro);
        return this._respuestaService.respuestaHttp(
          true,
          data,
          null,
          'correcto',
        );
      } else {
        return this._respuestaService.respuestaHttp(
          false,
          data,
          null,
          'no se encontraron registros',
        );
      }
    } catch (e) {
      console.log(e);
      return this._respuestaService.respuestaHttp(false, null, '', e.message);
    }
  }

  async create(data: CreateParGrupoProfesionDto) {
    const ruta = this._main + '/ createGrupoProfesion';
    try {
      const newGrupoProfesion = await this._parGrupoProfesion.create(data);
      const consolidado = await this._parGrupoProfesion.save(newGrupoProfesion);
      if (consolidado) {
        const resp = {
          idGrupoProfesion: consolidado.idGrupoProfesion,
          nombreGrupoProfesion: consolidado.nombreGrupoProfesion,
        };
        return this._respuestaService.respuestaHttp(
          true,
          resp,
          ruta,
          'Registro Exitoso',
        );
      }
    } catch (e) {
      return this._respuestaService.respuestaHttp(
        true,
        null,
        ruta,
        `Error en el Registro ${e.message}`,
      );
    }
  }

  async update(id: number, changes: UpdateParGrupoProfesionDto) {
    const ruta = this._main + '/ update';
    try {
      const profesion = await this._parGrupoProfesion.findOneBy({
        idGrupoProfesion: id,
      });
      if (!profesion) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      }
      this._parGrupoProfesion.merge(profesion, changes);
      const updateConsolidado = await this._parGrupoProfesion.save(profesion);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idGrupoProfesion: updateConsolidado.idGrupoProfesion,
        nombreGrupoProfesion: updateConsolidado.nombreGrupoProfesion,
      };
      return this._respuestaService.respuestaHttp(
        true,
        resp,
        ruta,
        'Modificacion Correcta',
      );
    } catch (e) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${e.message}`,
      );
    }
  }

  async remove(id: number) {
    const ruta = this._main + '/ remove';
    return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        "Temporalmente Inactivo",
    );
    try {
      const grupoProfesion = await this._parGrupoProfesion.findOneBy({
        idGrupoProfesion: id,
      });

      if (!grupoProfesion)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      const updateConsolidado = await this._parGrupoProfesion.delete(id);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      return this._respuestaService.respuestaHttp(
        true,
        id,
        ruta,
        'Eliminacion Correcta',
      );
      return this._parGrupoProfesion.delete(id);
    } catch (error) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${error.message}`,
      );
    }
  }

  async deleteLogicoParGrupoProfesion(
    idGrupoProfesion: number,
    usuario: string,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteLogicoParGrupoProfesion';
    const updateParGrupoProfesio = new UpdateParGrupoProfesionDto();

    try {
      const parGrupo = await this._parGrupoProfesion.findOneBy({
        idGrupoProfesion: idGrupoProfesion,
      });

      if (!updateParGrupoProfesio)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      updateParGrupoProfesio.bajaLogicaRegistro = true;
      updateParGrupoProfesio.usuarioModificacion = usuario;
      this._parGrupoProfesion.merge(parGrupo, updateParGrupoProfesio);

      const updateConsolidado = await this._parGrupoProfesion.save(parGrupo);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idGrupoProfesion: updateConsolidado.idGrupoProfesion,
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
