import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'pg';
import { InjectRepository } from '@nestjs/typeorm';
import { AutUsuarioRestriccionPerfil } from '../../core/domains/entities';
import { Repository } from 'typeorm';
import { RespuestaM } from '../../../../core/domain/models/respuesta.model';
import { formatoFecha } from '../../../../common/utility/all.utill';
import { RespuestaConsultaEnum } from '../../../../core/enum/respuesta-consulta.enum';
import { RespuestaService } from '../../../shared/services/respuesta.service';
import {
  CreateAutUsuarioRestriccionPerfil,
  UpdateAutUsuarioRestriccionPerfil
}
  from '../../core/domains/dtos/aut-usuario-restriccion-perfil.dto';
import { map } from 'rxjs/operators';
import { AutPerfilService } from './aut-perfil.service';
import { UpdateParClasificadorDetalleDto } from '../../../parametros/core/domains/dtos/par-clasificador-detalle.dto';

@Injectable()
export class AutUsuarioRestriccionPerfilService {
  // _autRecursoRepository: AutRecursoRepository;
  _main = 'AutRecursoService';
  private logger = new Logger('AutRecursoService');
  constructor(
    @InjectRepository(AutUsuarioRestriccionPerfil)
    private _autUsuarioRestriccionPerfil: Repository<AutUsuarioRestriccionPerfil>,
    private _respuestaService: RespuestaService,
  ) {
    // this._autRecursoRepository = new AutRecursoRepository(_client);
  }

  async createListAutUsuarioRestriccionPerfil(
    idUsuarioRestriccion: number,
    colIdPerfiles: number[],
  ): Promise<RespuestaM> {

    const ruta = this._main + ' /createAutUsuarioRestriccionPerfil';
    try {

      // get all perfil_recursos por idperfil
      const data = await this._autUsuarioRestriccionPerfil.find({
        where: {
          idUsuarioRestriccion: idUsuarioRestriccion,
        },
      });

      if (data) {
        // delete all registros
        const updateConsolidado = await this._autUsuarioRestriccionPerfil.remove(data);
        console.log('perfiles eliminados ', updateConsolidado);
      }

      console.log('perfiles', colIdPerfiles);
      if (colIdPerfiles) {
        // create los nuevos perfiles asignados al usuario restriccion
        for (const value of colIdPerfiles) {
          const dto = new CreateAutUsuarioRestriccionPerfil();
          dto.idUsuarioRestriccion = idUsuarioRestriccion;
          dto.idPerfil = value;
          const entity = await this._autUsuarioRestriccionPerfil.create(dto);
          await this._autUsuarioRestriccionPerfil.save(entity);
          console.log('nuevo perfil', value);
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
        `Error ${error.message}`,
      );
    }
  }

  //   async createAutUsuarioRestriccionPerfil(autUsuarioRestriccionPerfilDto: CreateAutUsuarioRestriccionPerfil) {
  //   const ruta = this._main + '/ createAutUsuarioRestriccionPerfil';
  //   try {
  //     const parSistema = await this._autPerfilService.findByIdAutPerfil(
  //       autUsuarioRestriccionPerfilDto.idPerfil,
  //     );
  //     if (!parSistema.data) {
  //       return this._respuestaService.respuestaHttp(
  //         false,
  //         null,
  //         ruta,
  //         'el id del perfil no existe',
  //       );
  //     }
  //     const newAutUsuarioRestriccionPerfil = this._autUsuarioRestriccionPerfil.create(autUsuarioRestriccionPerfilDto);
  //     const autUsuarioRestriccionPerfil = await this._autUsuarioRestriccionPerfil.save(newAutUsuarioRestriccionPerfil);
  //     if (autUsuarioRestriccionPerfil) {
  //       const resp = {
  //         idUsuarioRestriccionPerfil: autUsuarioRestriccionPerfil.idUsuarioRestriccionPerfil,
  //         idUsuarioRestriccion: autUsuarioRestriccionPerfil.idUsuarioRestriccion,
  //         idPerfil: autUsuarioRestriccionPerfil.idPerfil,
  //       };
  //       return this._respuestaService.respuestaHttp(
  //         true,
  //         resp,
  //         ruta,
  //         'Registro Exitoso',
  //       );
  //     }
  //   } catch (error) {
  //     return this._respuestaService.respuestaHttp(
  //       false,
  //       null,
  //       ruta,
  //       `Error en el Registro ${error.message}`,
  //     );
  //   }
  // }

  /*async updateAutUsuarioRestriccionPerfil(
    idAutUsuarioRestriccionPerfil: number,
    updateAutUsuarioRestriccionPerfil: UpdateAutUsuarioRestriccionPerfil,
  ) {
    const ruta = this._main + '/ updateAutUsuarioRestriccionPerfil';
    try {
      const respAutUsuarioRestriccionPerfil = await this._autUsuarioRestriccionPerfil.findOneBy({
        idUsuarioRestriccionPerfil: idAutUsuarioRestriccionPerfil,
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
      this._autUsuarioRestriccion.merge(respAutUsuarioRestriccion, updateAutUsuarioRestriccion);

      const updateConsolidado = await this._autUsuarioRestriccion.save(respAutUsuarioRestriccion);
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
  }*/
  async createRestriccionPerfilOne(dto:CreateAutUsuarioRestriccionPerfil){
    try {
      const savePerfil = this._autUsuarioRestriccionPerfil.create(dto);
      const result = await this._autUsuarioRestriccionPerfil.save(savePerfil);
      return this._respuestaService.respuestaHttp(true,result,null,null);
    }catch (e){
      return null;
    }
  }

  async deleteAllUsuarioRestriccionPerfil(idUsuarioRestriccion:number){
    try {
      const data = await this._autUsuarioRestriccionPerfil.find({
        where: {
          idUsuarioRestriccion: idUsuarioRestriccion,
        },
      });
      if (data) {
        // delete all registros
        const updateConsolidado = await this._autUsuarioRestriccionPerfil.remove(data);
      }
      return this._respuestaService.respuestaHttp(true,null,null,null);
    }catch (e){
      return null;
    }
  }
}
