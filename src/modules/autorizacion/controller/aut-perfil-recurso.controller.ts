import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AutPerfilRecursoService } from '../services/impl/aut-perfil-recurso.service';
import {
  CreateAutPerfilDto,
  UpdateAutPerfilRecursoDto,
  UpdateAutRecursoDto,
} from '../core/domains/dtos';
import { RespuestaM } from '../../../core/domain/models/respuesta.model';
import { CreateAutPerfilRecursoDto } from '../core/domains/dtos/aut-perfil-recurso.dto';

@ApiTags('Autorizacion - Aut-Perfil-Recurso')
@Controller('api/v1/aut-perfil-recurso/')
export class AutPerfilRecursoController {
  constructor(private _autPerfilRecursoService: AutPerfilRecursoService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear Aut Perfil Recurso',
  })
  create(
    @Body() createAutPerfilRecurso: CreateAutPerfilRecursoDto,
  ): Promise<RespuestaM> {
    return this._autPerfilRecursoService.createAutPerfilRecurso(
      createAutPerfilRecurso,
    );
  }

  @Get(':idAutPerfilRecurso')
  findByIdAutPerfil(
    @Param('idAutPerfilRecurso', ParseIntPipe)
    idAutPerfilRecurso: number,
  ): Promise<RespuestaM> {
    return this._autPerfilRecursoService.findByIdAutPerfilRecurso(
      idAutPerfilRecurso,
    );
  }

  @Put(':idAutPerfilRecurso')
  @ApiOperation({
    summary: 'Modificar Aut Perfil Recurso',
  })
  updateParInstitucion(
    @Param('idAutPerfilRecurso', ParseIntPipe) idAutPerfilRecurso: number,
    @Body() updateAutPerfilRecurso: UpdateAutPerfilRecursoDto,
  ): Promise<RespuestaM> {
    return this._autPerfilRecursoService.updatePerfilRecurso(
      idAutPerfilRecurso,
      updateAutPerfilRecurso,
    );
  }
}
