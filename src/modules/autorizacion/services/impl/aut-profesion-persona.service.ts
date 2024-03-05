import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AutProfesionPersona } from '../../core/domains/entities';
import { Repository } from 'typeorm';
import { RespuestaService } from 'src/modules/shared/services/respuesta.service';
import { CreateAutPersonaDto } from '../../core/domains/dtos';
import { CreateAutProfesionPersonaDto, UpdateAutProfesionPersonaDto } from '../../core/domains/dtos/aut-profesion-persona.dto';
import { ParGrupoProfesionService } from 'src/modules/parametros/services/impl';
import { RespuestaConsultaEnum } from 'src/core/enum/respuesta-consulta.enum';

@Injectable()
export class AutProfesionPersonaService {
  _main = 'AutProfesionPersonaService';
  constructor(
    @InjectRepository(AutProfesionPersona)
    private _autProfesionPersona: Repository<AutProfesionPersona>,
    private _respuestaService: RespuestaService,
    private _parGrupoProfesion: ParGrupoProfesionService,
  ) {}

  async createAutProfesionPersona(createAutPersona: CreateAutProfesionPersonaDto) {
    const ruta = this._main + ' /createAutPersona';
    try {
      let autPersona = null;
      autPersona = this._autProfesionPersona.save(createAutPersona);
      if(!autPersona){
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          RespuestaConsultaEnum.ERROR_EN_EL_REGISTRO,
        );
      }
      return this._respuestaService.respuestaHttp(
        true,
        autPersona,
        ruta,
        RespuestaConsultaEnum.ERROR_EN_EL_REGISTRO,
      );;

    } catch (e) {
      console.log(e);
    }
  }

  async updateAutProfesionPersona(id: number, updateAutProfesionPersona: UpdateAutProfesionPersonaDto){
    try{
      const profesion = await this._autProfesionPersona.findOneBy({
				idPersona: id
			  });
        profesion.usuarioModificacion = 'postgres';
			  this._autProfesionPersona.merge(profesion, updateAutProfesionPersona);
			  return await this._autProfesionPersona.save(profesion);
    }catch (e){
      console.log(e);
    }
  }
}
