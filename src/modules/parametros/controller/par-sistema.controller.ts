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
  CreateParSistemaDto,
  UpdateParSistemaDto,
} from '../core/domains/dtos/par-sistema.dto';
import { ParSistemaService } from '../services/impl';
import { UpdateParInstitucionDto } from '../core/domains/dtos/par-institucion.dto';

@ApiTags('Parametros - Par Sistema')
@Controller('api/v1/par-sistema/')
export class ParSistemaController {
  constructor(private _parSistemaService: ParSistemaService) {}
  @Get('listar-par-sistema')
  @ApiOperation({ summary: 'Lista par sistema' })
  async findAllParSistema(@Query() paginadorDto: PaginationDto) {
    return this._parSistemaService.findAllParSistema(paginadorDto);
  }

  @Post('add-par-sistema')
  @ApiOperation({ summary: 'adicionar par sistema' })
  async createParSistema(@Body() createParSistema: CreateParSistemaDto) {
    return this._parSistemaService.createParSistema(createParSistema);
  }

  @Get(':idSistema')
  @ApiOperation({
    summary: 'Buscar el sistema por id',
  })
  getOne(@Param('idSistema', ParseIntPipe) idSistema: number) {
    return this._parSistemaService.findByIdSistema(idSistema);
  }

  /*@Get('parInstitucion/:idInstitucion')
  @ApiOperation({
    summary: 'Buscar por Id Par Institucion',
  })
  getOneIdGrupoInstitucion(
    @Param('idInstitucion', ParseIntPipe) idInstitucion: number,
  ) {
    return this._parSistemaService.findByIdInstitucion(idInstitucion);
  }*/

  @Put(':idSistema')
  @ApiOperation({
    summary: 'Modificar Sistema',
  })
  updateParSistema(
    @Param('idSistema', ParseIntPipe) idSistema: number,
    @Body() updateParSistema: UpdateParSistemaDto,
  ) {
    return this._parSistemaService.updateParSistema(
      idSistema,
      updateParSistema,
    );
  }

  @Patch('delete-logico/:idSistema')
  @ApiOperation({
    summary: 'Eliminacion Logica sistema',
  })
  deleteLogicoSistema(@Param('idSistema', ParseIntPipe) idSistema: number) {
    const usuario = 'nilo';
    return this._parSistemaService.deleteLogicoParSistema(idSistema, usuario);
  }

  @Delete(':idSistema')
  @ApiOperation({
    summary: 'Eliminacion id sistema',
  })
  deleteInstitucion(@Param('idSistema', ParseIntPipe) idSistema: number) {
    return this._parSistemaService.deleteParSistema(idSistema);
  }
}
