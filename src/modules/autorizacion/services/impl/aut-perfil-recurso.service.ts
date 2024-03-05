import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AutPerfilRecurso } from '../../core/domains/entities';
import { Repository } from 'typeorm';
import { AutRecursoService } from './aut-recurso.service';
import {
  CreateAutPerfilDto,
  UpdateAutPerfilRecursoDto,
} from '../../core/domains/dtos';
import { RespuestaM } from '../../../../core/domain/models/respuesta.model';
import { CreateAutPerfilRecursoDto } from '../../core/domains/dtos/aut-perfil-recurso.dto';
import { AutPerfilService } from './aut-perfil.service';
import { RespuestaService } from '../../../shared/services/respuesta.service';
import { formatoFecha } from '../../../../common/utility/all.utill';
import { UpdateParGrupoInstitucionDto } from '../../../parametros/core/domains/dtos/par-grupo-institucion.dto';

@Injectable()
export class AutPerfilRecursoService {
  _main = 'AutPerfilRecursoService';
  private logger = new Logger('AutPerfilRecursoService');
  constructor(
    @InjectRepository(AutPerfilRecurso)
    private _autPerfilRecurso: Repository<AutPerfilRecurso>,
    // private _autPerfilService: AutPerfilService,
    private _autRecursoService: AutRecursoService,
    private _respuestaService: RespuestaService,
  ) {}

  async createAutPerfilRecurso(
    autPerfilRecursoDto: CreateAutPerfilRecursoDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + ' /createAutPerfilRecurso';
    try {
      //Verificamos que exista el id del sistema enviado para registro
      const autRecurso = await this._autRecursoService.findOneByIdRecurso(
        autPerfilRecursoDto.idRecurso,
      );
      if (!autRecurso.data) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'No existe el Identificador de Aut Recurso',
        );
      }
      // const autPerfil = await this._autPerfilService.findByIdAutPerfil(
      //   autPerfilRecursoDto.idPerfil,
      // );
      // if (!autPerfil.data) {
      //   return this._respuestaService.respuestaHttp(
      //     false,
      //     null,
      //     ruta,
      //     'No existe el Perfil',
      //   );
      // }
      const newAutPerfilRecurso = await this._autPerfilRecurso.create(
        autPerfilRecursoDto,
      );
      const createAutPerfilRecurso = await this._autPerfilRecurso.save(
        newAutPerfilRecurso,
      );
      if (createAutPerfilRecurso) {
        const resp = {
          idPerfilRecurso: createAutPerfilRecurso.idPerfilRecurso,
          idRecurso: createAutPerfilRecurso.idRecurso,
          idPerfil: createAutPerfilRecurso.idPerfil,
        };
        return this._respuestaService.respuestaHttp(
          true,
          resp,
          ruta,
          'Perfil agregado exitosamente',
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
        `Error comunicate con soporte ${error.message}`,
      );
    }
  }

  async createListAutPerfilRecurso(
    idPerfil: number,
    colIdRecurso: number[],
  ): Promise<RespuestaM> {
    const ruta = this._main + ' /createAutPerfilRecurso';
    try {
      // get all perfil_recursos por idperfil
      const data = await this._autPerfilRecurso.find({
        where: {
          idPerfil: idPerfil,
        },
      });
      //console.log('recursos del perfil', data);

      if (data) {
        // delete all registros
        const updateConsolidado = await this._autPerfilRecurso.remove(data);
        console.log('recursos eliminado', updateConsolidado);
      }
      //console.log('recursos', colIdRecurso);
      if (colIdRecurso) {
        // create los nuevos recursos asignados
        for (const value of colIdRecurso) {
          const dto = new CreateAutPerfilRecursoDto();
          dto.idPerfil = idPerfil;
          dto.idRecurso = value;
          const entity = await this._autPerfilRecurso.create(dto);
          await this._autPerfilRecurso.save(entity);
          console.log('nuevo recurso', value);
        }

        // [TODO] : revisar porque no funciona con foreach
        // colIdRecurso.forEach(async function (value) {
        //   const dto = new CreateAutPerfilRecursoDto();
        //   dto.idPerfil = idPerfil;
        //   dto.idRecurso = value;
        //   const entity = await this._autPerfilRecurso.create(dto);
        //   await this._autPerfilRecurso.save(entity);
        //   console.log("nuevo recurso", value);
        // });
      }
    } catch (error) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error comunicate con soporte ${error.message}`,
      );
    }
  }

  async findByIdAutPerfilRecurso(
    idAutPerfilRecurso: number,
  ): Promise<RespuestaM> {
    const ruta = this._main + ' /findByIdAutPerfilRecurso';
    let autPerfilRecurso = null;
    try {
      autPerfilRecurso = await this._autPerfilRecurso.findOne({
        select: {
          idPerfilRecurso: true,
          idRecurso: true,
          idPerfil: true,
          fechaRegistro: true,
        },
        where: {
          idPerfilRecurso: idAutPerfilRecurso,
          bajaLogicaRegistro: false,
        },
      });
      if (autPerfilRecurso) {
        autPerfilRecurso.fechaRegistro = formatoFecha(
          autPerfilRecurso.fechaRegistro,
        );

        return this._respuestaService.respuestaHttp(
          true,
          autPerfilRecurso,
          ruta,
          'Listado exitoso',
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
        `Error comunicate con soporte ${error.message}`,
      );
    }
  }

  async updatePerfilRecurso(
    idPerfilRecurso: number,
    updatePerfilRecurso: UpdateAutPerfilRecursoDto,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ updatePerfilRecurso';
    try {
      const perfilRecurso = await this._autPerfilRecurso.findOneBy({
        idPerfil: idPerfilRecurso,
      });
      if (!perfilRecurso)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado',
        );
      this._autPerfilRecurso.merge(perfilRecurso, updatePerfilRecurso);

      const updateConsolidado = await this._autPerfilRecurso.save(
        perfilRecurso,
      );

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en la Modificacion',
        );

      const resp = {
        idPerfil: updateConsolidado.idPerfil,
        idPerfilRecurso: updateConsolidado.idPerfilRecurso,
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
        `Error comunicate con soporte${error.message}`,
      );
    }
  }
}
