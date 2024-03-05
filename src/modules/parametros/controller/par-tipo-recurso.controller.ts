import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PaginationDto } from '../../../core/domain/dtos/pagination.dto';
import { CreateParInstitucionDto } from '../core/domains/dtos/par-institucion.dto';
import {
  CreateParTipoRecursoDto,
  UpdateParTipoRecursoDto,
} from '../core/domains/dtos/par-tipo-recurso.dto';
import { ParTipoRecursoService } from '../services/impl/par-tipo-recurso.service';
import { RespuestaM } from '../../../core/domain/models/respuesta.model';
import { UpdateParGrupoInstitucionDto } from '../core/domains/dtos/par-grupo-institucion.dto';

@ApiTags('Parametros - Par Tipo Recurso')
@Controller('api/v1/par-tipo-recurso/')
export class ParTipoRecursoController {
  constructor(private _parTipoRecursoService: ParTipoRecursoService) {}
  @Get('listar-par-tipo-recurso')
  @ApiOperation({ summary: 'Lista par tipo recurso' })
  async findAllParTipoRecurso(@Query() paginadorDto: PaginationDto) {
    return this._parTipoRecursoService.findAllParTipoRecurso(paginadorDto);
  }

  @Get(':idParTipoRecurso')
  @ApiOperation({
    summary: 'Buscar el par tipo recurso por id',
  })
  getOne(
    @Param('idParTipoRecurso', ParseIntPipe) idParTipoRecurso: number,
  ): Promise<RespuestaM> {
    return this._parTipoRecursoService.findOne(idParTipoRecurso);
  }

  @Post('add-par-tipo-recurso')
  @ApiOperation({ summary: 'adicionar par tipo recurso' })
  async createParTipoRecurso(
    @Body() createParTipoRecursoDto: CreateParTipoRecursoDto,
  ) {
    return this._parTipoRecursoService.createParTipoRecurso(
      createParTipoRecursoDto,
    );
  }

  @Put(':idParTipoRecurso')
  @ApiOperation({
    summary: 'Modificar par Tipo Recurso',
  })
  updateParTipoRecurso(
    @Param('idParTipoRecurso', ParseIntPipe) idParTipoRecurso: number,
    @Body() updateParTipoRecursoDto: UpdateParTipoRecursoDto,
  ) {
    updateParTipoRecursoDto.usuarioModificacion = 'luchisimo';
    return this._parTipoRecursoService.updateParTipoRecurso(
      idParTipoRecurso,
      updateParTipoRecursoDto,
    );
  }

  @Patch('delete-logico/:idParTipoRecurso')
  @ApiOperation({
    summary: 'Eliminacion Par Tipo Recurso',
  })
  deleteLogicoParTipoRecurso(
    @Param('idParTipoRecurso', ParseIntPipe) idParTipoRecurso: number,
  ) {
    const usuario = 'nilo';
    return this._parTipoRecursoService.deleteLogicoParTipoRecurso(
      idParTipoRecurso,
      usuario,
    );
  }

  @Delete(':idParTipoRecurso')
  @ApiOperation({
    summary: 'Eliminacion id par tipo recurso',
  })
  deleteParTipoRecurso(
    @Param('idParTipoRecurso', ParseIntPipe) idParTipoRecurso: number,
  ) {
    return this._parTipoRecursoService.deleteParTipoRecurso(idParTipoRecurso);
  }
}
