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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateParGrupoInstitucion,
  UpdateParGrupoInstitucionDto,
} from '../core/domains/dtos/par-grupo-institucion.dto';
import { PaginationDto } from '../../../core/domain/dtos/pagination.dto';
import { ParGrupoInstitucionService } from '../services/impl/par-grupo-institucion.service';
import { RespuestaM } from '../../../core/domain/models/respuesta.model';
import { UpdateParClasificadorDto } from '../core/domains/dtos/par-clasificador.dto';

@ApiTags('Parametros - Par Grupo Institucion')
@Controller('api/v1/par-grupo-institucion/')
export class ParGrupoInstitucionController {
  constructor(private parGrupoInstitucionService: ParGrupoInstitucionService) {}
  @Post('addpargrupoinstitucion')
  createParGrupoInstitucion(
    @Body() createParGrupoInstitucionDto: CreateParGrupoInstitucion,
  ) {
    return this.parGrupoInstitucionService.createParGrupoInstitucion(
      createParGrupoInstitucionDto,
    );
  }

  @Get('findallpargrupoinstitucion')
  getFindAllParGrupoInstitucion(@Query() paginadorDto: PaginationDto) {
    return this.parGrupoInstitucionService.findAllParGrupoInstitucionService(
      paginadorDto,
    );
  }

  @Get(':idGrupoInstitucion')
  @ApiOperation({
    summary: 'Buscar el grupo institucion por id',
  })
  getOne(
    @Param('idGrupoInstitucion', ParseIntPipe) idGrupoInstitucion: number,
  ): Promise<RespuestaM> {
    return this.parGrupoInstitucionService.findOne(idGrupoInstitucion);
  }

  @Put(':idGrupoInstitucion')
  @ApiOperation({
    summary: 'Modificar grupo institucion',
  })
  updateParClasificador(
    @Param('idGrupoInstitucion', ParseIntPipe) idGrupoInstitucion: number,
    @Body() updateParGrupoInstitucionDto: UpdateParGrupoInstitucionDto,
  ) {
    updateParGrupoInstitucionDto.usuarioModificacion = 'luchisimo';
    return this.parGrupoInstitucionService.updateParGrupoInstitucion(
      idGrupoInstitucion,
      updateParGrupoInstitucionDto,
    );
  }

  @Patch('delete-logico/:idGrupoInstitucion')
  @ApiOperation({
    summary: 'Eliminacion Par Grupo Institucion',
  })
  deleteLogicoParClasificador(
    @Param('idGrupoInstitucion', ParseIntPipe) idGrupoInstitucion: number,
  ) {
    const usuario = 'nilo';
    return this.parGrupoInstitucionService.deleteLogicoParGrupoInstitucion(
      idGrupoInstitucion,
      usuario,
    );
  }
  @Delete(':idGrupoInstitucion')
  @ApiOperation({
    summary: 'Eliminacion id grupo institucion',
  })
  deleteParClasificador(
    @Param('idGrupoInstitucion', ParseIntPipe) idGrupoInstitucion: number,
  ) {
    return this.parGrupoInstitucionService.deleteParGrupoInstitucion(
      idGrupoInstitucion,
    );
  }
}
