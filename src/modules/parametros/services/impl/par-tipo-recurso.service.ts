import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParTipoRecurso } from '../../core/domains/entities/par-tipo-recurso.entity';
import { Repository } from 'typeorm';
import { RespuestaService } from '../../../shared/services/respuesta.service';
import { PaginationDto } from '../../../../core/domain/dtos/pagination.dto';
import { RespuestaM } from '../../../../core/domain/models/respuesta.model';
import { formatoFecha } from '../../../../common/utility/all.utill';
import {
  CreateParGrupoInstitucion,
  UpdateParGrupoInstitucionDto,
} from '../../core/domains/dtos/par-grupo-institucion.dto';
import {
  CreateParTipoRecursoDto,
  UpdateParTipoRecursoDto,
} from '../../core/domains/dtos/par-tipo-recurso.dto';

@Injectable()
export class ParTipoRecursoService {
  _main = 'ParTipoRecursoService';
  constructor(
    @InjectRepository(ParTipoRecurso)
    private _parTipoRecurso: Repository<ParTipoRecurso>,
    private _respuestaService: RespuestaService,
  ) {}
  async findAllParTipoRecurso(
    paginadorDto: PaginationDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ findAllParTipoRecurso';

    let data = null;
    try {
      if (paginadorDto.limit > 0) {
        data = await this._parTipoRecurso.find({
          select: {
            idTipoRecurso: true,
            nombreTipoRecurso: true,
            descripcionTipoRecurso: true,
            plataforma: true,
            formato: true,
            fechaRegistro: true,
          },
          take: paginadorDto.limit,
          skip: paginadorDto.offset,
          order: {
            idTipoRecurso: 'asc',
          },
        });
      } else {
        data = await this._parTipoRecurso.find({
          select: {
            idTipoRecurso: true,
            nombreTipoRecurso: true,
            descripcionTipoRecurso: true,
            plataforma: true,
            formato: true,
            fechaRegistro: true,
          },
          order: {
            idTipoRecurso: 'asc',
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

  async findOne(id: number): Promise<RespuestaM> {
    const ruta = this._main + '/ findOne';
    let parTipoRecurso = null;
    try {
      parTipoRecurso = await this._parTipoRecurso.findOne({
        select: {
          idTipoRecurso: true,
          nombreTipoRecurso: true,
          fechaRegistro: true,
        },
        where: {
          idTipoRecurso: id,
          bajaLogicaRegistro: false,
        },
      });
      if (parTipoRecurso) {
        parTipoRecurso.fechaRegistro = formatoFecha(
          parTipoRecurso.fechaRegistro,
        );
        return this._respuestaService.respuestaHttp(
          true,
          parTipoRecurso,
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

  async createParTipoRecurso(parTipoRecurso: CreateParTipoRecursoDto) {
    const ruta = this._main + '/ createParTipoRecurso';
    try {
      const newParTipoRecurso = this._parTipoRecurso.create(parTipoRecurso);
      const consolidadoParTipo = await this._parTipoRecurso.save(
        newParTipoRecurso,
      );
      if (consolidadoParTipo) {
        const resp = {
          idTipoRecurso: consolidadoParTipo.idTipoRecurso,
          nombreTipoRecurso: consolidadoParTipo.nombreTipoRecurso,
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

  async updateParTipoRecurso(
    idTipoRecurso: number,
    updateParTipoRecurso: UpdateParTipoRecursoDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ updateParTipoRecurso';
    try {
      const parTipoRecurso = await this._parTipoRecurso.findOneBy({
        idTipoRecurso: idTipoRecurso,
      });
      if (!parTipoRecurso)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      this._parTipoRecurso.merge(parTipoRecurso, updateParTipoRecurso);

      const updateConsolidado = await this._parTipoRecurso.save(parTipoRecurso);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idTipoRecurso: updateConsolidado.idTipoRecurso,
        nombreTipoRecurso: updateConsolidado.nombreTipoRecurso,
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

  async deleteLogicoParTipoRecurso(
    idParTipoRecurso: number,
    usuario: string,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteLogicoParTipoRecurso';
    const updateParTipoRecurso = new UpdateParTipoRecursoDto();

    try {
      const parTipoRecurso = await this._parTipoRecurso.findOneBy({
        idTipoRecurso: idParTipoRecurso,
      });

      if (!updateParTipoRecurso)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      updateParTipoRecurso.bajaLogicaRegistro = true;
      updateParTipoRecurso.usuarioModificacion = usuario;
      this._parTipoRecurso.merge(parTipoRecurso, updateParTipoRecurso);

      const updateConsolidado = await this._parTipoRecurso.save(parTipoRecurso);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idTipoRecurso: updateConsolidado.idTipoRecurso,
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

  async deleteParTipoRecurso(idParTipo: number): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteParTipoRecurso';
    return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        "Temporalmente Inactivo",
    );
    try {
      const parTipo = await this._parTipoRecurso.findOneBy({
        idTipoRecurso: idParTipo,
      });

      if (!parTipo)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      const updateConsolidado = await this._parTipoRecurso.delete(idParTipo);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      return this._respuestaService.respuestaHttp(
        true,
        idParTipo,
        ruta,
        'Eliminacion Correcta',
      );
    } catch (error) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${error.details}`,
      );
    }
  }
}
