import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParSistema } from '../../core/domains/entities/par-sistema.entity';
import { Repository } from 'typeorm';
import { RespuestaService } from '../../../shared/services/respuesta.service';
import { PaginationDto } from '../../../../core/domain/dtos/pagination.dto';
import { RespuestaM } from '../../../../core/domain/models/respuesta.model';
import { formatoFecha } from '../../../../common/utility/all.utill';
import {
  CreateParSistemaDto,
  UpdateParSistemaDto,
} from '../../core/domains/dtos/par-sistema.dto';
import { ParInstitucionService } from './par-institucion.service';
import { UpdateParInstitucionDto } from '../../core/domains/dtos/par-institucion.dto';

@Injectable()
export class ParSistemaService {
  _main = 'ParSistemaService';
  constructor(
    @InjectRepository(ParSistema)
    private _parSistema: Repository<ParSistema>,
    //private _parInstitucion: ParInstitucionService,
    private _respuestaService: RespuestaService,
  ) {}

  async findAllParSistema(paginadorDto: PaginationDto): Promise<RespuestaM> {
    const ruta = this._main + '/ findAllParSistema';
    let data = null;
    try {
      if (paginadorDto.limit > 0) {
        data = await this._parSistema.find({
          select: {
            idSistema: true,
            identificadorSistema: true,
            nombreSistema: true,
            descripcionSistema: true,
            fechaRegistro: true,
          },
          take: paginadorDto.limit,
          skip: paginadorDto.offset,
          order: {
            idSistema: 'asc',
          },
          where: {
            bajaLogicaRegistro: false,
          },
        });
      } else {
        data = await this._parSistema.find({
          select: {
            idSistema: true,
            identificadorSistema: true,
            nombreSistema: true,
            descripcionSistema: true,
            fechaRegistro: true,
          },
          order: {
            idSistema: 'asc',
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

  async createParSistema(parSistemaDto: CreateParSistemaDto) {
    const ruta = this._main + ' /createParSistema';
    try {
      const newSistema = await this._parSistema.create(parSistemaDto);
      const createParSistema = await this._parSistema.save(newSistema);
      if (createParSistema) {
        const resp = {
          idSistema: createParSistema.idSistema,
          identificadorSistema: createParSistema.identificadorSistema,
          nombreSistema: createParSistema.nombreSistema,
          descripcionSistema: createParSistema.descripcionSistema,
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

  async findByIdSistema(idParSistema: number): Promise<RespuestaM> {
    const ruta = this._main + ' /findByIdSistema';
    let parSistema = null;
    try {
      parSistema = await this._parSistema.findOne({
        select: {
          idSistema: true,
          identificadorSistema: true,
          nombreSistema: true,
          descripcionSistema: true,
          fechaRegistro: true,
        },
        where: {
          idSistema: idParSistema,
          bajaLogicaRegistro: false,
        },
      });
      if (parSistema) {
        parSistema.fechaRegistro = formatoFecha(parSistema.fechaRegistro);

        return this._respuestaService.respuestaHttp(
          true,
          parSistema,
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

  async findByIdInstitucion(idInstitucion: number): Promise<RespuestaM> {
    const ruta = this._main + ' /findByIdInstitucion';
    let parSistema = null;
    try {
      parSistema = await this._parSistema.find({
        select: {
          idSistema: true,
          identificadorSistema: true,
          nombreSistema: true,
          descripcionSistema: true,
          fechaRegistro: true,
        },
        where: {
          bajaLogicaRegistro: false,
        },
      });

      if (parSistema && parSistema.length > 0) {
        parSistema.map((datos) => {
          datos.fechaRegistro = formatoFecha(parSistema.fechaRegistro);
        });

        return this._respuestaService.respuestaHttp(
          true,
          parSistema,
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

  async updateParSistema(
    idParSistema: number,
    updateParSistema: UpdateParSistemaDto,
  ) {
    const ruta = this._main + '/ updateParSistema';
    try {
      const respParSistema = await this._parSistema.findOneBy({
        idSistema: idParSistema,
      });
      if (!respParSistema)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );

      this._parSistema.merge(respParSistema, updateParSistema);

      const updateConsolidado = await this._parSistema.save(respParSistema);
      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idSistema: updateConsolidado.idSistema,
        identificadorSistema: updateConsolidado.identificadorSistema,
        nombreSistema: updateConsolidado.nombreSistema,
        descripcionSistema: updateConsolidado.descripcionSistema,
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

  async deleteLogicoParSistema(
    idParSistema: number,
    usuario: string,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteLogicoParSistema';
    const updateParSistema = new UpdateParSistemaDto();

    try {
      const parSistema = await this._parSistema.findOneBy({
        idSistema: idParSistema,
      });

      if (!parSistema)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      updateParSistema.bajaLogicaRegistro = true;
      updateParSistema.usuarioModificacion = usuario;
      this._parSistema.merge(parSistema, updateParSistema);

      const updateConsolidado = await this._parSistema.save(parSistema);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idSistema: updateConsolidado.idSistema,
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

  async deleteParSistema(idSistema: number): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteParSistema';
    return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        "Temporalmente Inactivo",
    );
    try {
      const parSistema = await this._parSistema.findOneBy({
        idSistema: idSistema,
      });

      if (!parSistema)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      const updateConsolidado = await this._parSistema.delete(idSistema);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      return this._respuestaService.respuestaHttp(
        true,
        idSistema,
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
