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
} from '@nestjs/common';
import { AutRecursoService } from '../services/impl/aut-recurso.service';
import { RespuestaM } from '../../../core/domain/models/respuesta.model';
import {
  CreateAutRecursoDto,
  UpdateAutRecursoDto,
} from '../core/domains/dtos/aut-recurso.dto';
import { UpdateParSistemaDto } from '../../parametros/core/domains/dtos/par-sistema.dto';

@ApiTags('Autorizacion - Aut-Recurso')
@Controller('api/v1/aut-recurso/')
export class AutRecursoController {
  constructor(private _autRecursoService: AutRecursoService) {}

  @Post('createautrecurso')
  @ApiOperation({ summary: 'adicionar autrecurso' })
  async createAutRecuso(
    @Body() createAutRecurso: CreateAutRecursoDto,
  ): Promise<RespuestaM> {
    return this._autRecursoService.createAutRecurso(createAutRecurso);
  }

  @Put(':idAutRecurso')
  @ApiOperation({
    summary: 'Modificar Aut Recurso',
  })
  updateAutRecurso(
      @Param('idAutRecurso', ParseIntPipe) idAutRecurso: number,
      @Body() updateAtRecurso: UpdateAutRecursoDto,
  ): Promise<RespuestaM> {
    return this._autRecursoService.updateAutRecurso(
        idAutRecurso,
        updateAtRecurso,
    );
  }

  @Get('autrecurso/:idTipoRecurso')
  @ApiOperation({
    summary: 'Lista la Autorizacion Recurso por el Id tipo de Recurso ',
  })
  findByAutRecursoByIdTipoRecurso(
    @Param('idTipoRecurso', ParseIntPipe)
    idTipoRecurso: number,
  ): Promise<RespuestaM> {
    return this._autRecursoService.findByAutRecursoByIdTipoRecurso(
      idTipoRecurso,
    );
  }

  @Get('autrecursoid/:idRecurso')
  @ApiOperation({
    summary:
      'Lista Los hijos de la tabla recursiva aut-recurso por el id padre ',
  })
  listarHijosAutRecursoByIdPadre(
    @Param('idRecurso', ParseIntPipe)
    idRecurso: number,
  ): Promise<RespuestaM> {
    return this._autRecursoService.listarHijosAutRecursoByIdPadre(idRecurso);
  }

  @Patch('delete-logico/:idAutRecurso')
  @ApiOperation({
    summary: 'Eliminacion Logica AutRecurso',
  })
  deleteLogicoAutRecurso(
    @Param('idAutRecurso', ParseIntPipe) idAutRecurso: number,
  ) {
    const usuario = 'nilo';
    return this._autRecursoService.deleteLogicoAutRecurso(
      idAutRecurso,
      usuario,
    );
  }

  @Get('autsistema/:idTipoSistema')
  @ApiOperation({
    summary: 'Lista la Autorizacion Recurso por el Id Sistema ',
  })
  findByAutRecursoByIdTipoSistema(
    @Param('idTipoSistema', ParseIntPipe)
    idTipoSistema: number,
  ): Promise<RespuestaM> {
    return this._autRecursoService.findByAutRecursoByIdTipoSistema(
      idTipoSistema,
    );
  }

  @Get('listaRecursosBySistema/:idSistema')
  @ApiOperation({
    summary: 'Lista la Autorizacion Recurso por el Id Sistema ',
  })
  findAllGestionRecursoBySistema(
    @Param('idSistema', ParseIntPipe) idSistema: number,
  ): Promise<RespuestaM> {
    return this._autRecursoService.findAllGestionRecursoBySistema(idSistema);
  }

  @Delete(':idAutRecurso')
  @ApiOperation({
    summary: 'Eliminacion id aut recurso',
  })
  deleteInstitucion(@Param('idAutRecurso', ParseIntPipe) idAutRecurso: number) {
    return this._autRecursoService.deleteAutRecurso(idAutRecurso);
  }
}
