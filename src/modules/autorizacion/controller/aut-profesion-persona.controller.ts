import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAutProfesionPersonaDto } from '../core/domains/dtos/aut-profesion-persona.dto';
import { AutProfesionPersona } from '../core/domains/entities';
import { AutProfesionPersonaService } from '../services/impl/aut-profesion-persona.service';
@ApiTags('Autorizacion - Aut-Profesion-Persona')
@Controller('api/v1/aut-profesion-persona/')
export class AutProfesionPersonaController {
  constructor(private _autProfesionPersona:AutProfesionPersonaService){

  }
  @Post()
  @ApiOperation({
    summary: 'Crear Aut Perfil Recurso',
  })
  createAutProfesion(
    @Body() createAutProfesion: CreateAutProfesionPersonaDto,
  ) {
    return this._autProfesionPersona.createAutProfesionPersona(createAutProfesion);
  }
}
