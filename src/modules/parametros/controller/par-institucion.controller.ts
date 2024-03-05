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
import {
  CreateParInstitucionDto,
  UpdateParInstitucionDto,
} from '../core/domains/dtos/par-institucion.dto';
import { ParInstitucionService } from '../services/impl/par-institucion.service';
import { RespuestaM } from '../../../core/domain/models/respuesta.model';

@ApiTags('Parametros - Par Institucion')
@Controller('api/v1/par-institucion/')
export class ParInstitucionController {
  constructor(private _parInstitucionService: ParInstitucionService) {}
  @Get('listar-par-institucion')
  @ApiOperation({ summary: 'Lista par institucion' })
  async findAllParInstitucion(@Query() paginadorDto: PaginationDto) {
    return this._parInstitucionService.findAllParInstitucion(paginadorDto);
  }

  @Get(':idIstitucion')
  @ApiOperation({
    summary: 'Buscar institucion por Id',
  })
  getOneInstitucion(@Param('idIstitucion', ParseIntPipe) idIstitucion: number) {
    return this._parInstitucionService.finByIdParInstitucion(idIstitucion);
  }

  /*@Get('grupoInstitucion/:idGrupoIntitucion')
  @ApiOperation({
    summary: 'Buscar por Id Grupo Institucion',
  })
  getOneIdGrupoInstitucion(
    @Param('idGrupoIntitucion', ParseIntPipe) idGrupoIntitucion: number,
  ) {
    return this._parInstitucionService.finByIdParGrupoInstitucion(
      idGrupoIntitucion,
    );
  }*/
  @Post('add-par-institucion')
  @ApiOperation({ summary: 'adicionar par institucion' })
  async createParInstitucion(
    @Body() createParInstitucion: CreateParInstitucionDto,
  ) {
    return this._parInstitucionService.createParInstitucion(
      createParInstitucion,
    );
  }

  @Put(':idIstitucion')
  @ApiOperation({
    summary: 'Modificar institucion',
  })
  updateParInstitucion(
    @Param('idIstitucion', ParseIntPipe) idIstitucion: number,
    @Body() updateParInstitucion: UpdateParInstitucionDto,
  ) {
    return this._parInstitucionService.updateParInstitucion(
      idIstitucion,
      updateParInstitucion,
    );
  }

  @Patch('delete-logico/:idIstitucion')
  @ApiOperation({
    summary: 'Eliminacion Logica institucion',
  })
  deleteLogicoInstitucion(
    @Param('idIstitucion', ParseIntPipe) idIstitucion: number,
  ) {
    const usuario = 'nilo';
    return this._parInstitucionService.deleteLogicoParInstitucion(
      idIstitucion,
      usuario,
    );
  }

  @Delete(':idIstitucion')
  @ApiOperation({
    summary: 'Eliminacion id institucion',
  })
  deleteInstitucion(@Param('idIstitucion', ParseIntPipe) idIstitucion: number) {
    return this._parInstitucionService.deleteParInstitucion(idIstitucion);
  }
}
