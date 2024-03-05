import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PaginationDto } from '../../../core/domain/dtos/pagination.dto';
import { RefEstructuraEstablecimientoService } from '../services/impl/ref-estructura-establecimiento.service';

@ApiTags('Referencia-Geografia')
@Controller('api/v1/geografia/')
export class RefEstructuraEstablecimientoController {
  constructor(
    private _refEstructuraEstablecimientoService: RefEstructuraEstablecimientoService,
  ) {}

  @Get('departamentos')
  @ApiOperation({
    summary: 'Listar Departametos',
  })
  async findAllDepartamentos() {
    return this._refEstructuraEstablecimientoService.findAllDepartamentos();
  }

  @Get('redes/:codDepartamento/:idInstitucion/:idSubsector')
  @ApiOperation({
    summary: 'Listar Redes',
  })
  async findAllRedByCodigoDepartamento(
    @Param('codDepartamento', ParseIntPipe) codDepartamento: number,
    @Param('idInstitucion', ParseIntPipe) idInstitucion: number,
    @Param('idSubsector', ParseIntPipe) idSubsector: number,
  ) {
    return this._refEstructuraEstablecimientoService.findAllRedByCodigoDepartamento(
      codDepartamento,
      idInstitucion,
      idSubsector
    );
  }

  @Get('municipios/:codDepartamento/:codArea')
  @ApiOperation({
    summary: 'Listar Municipios',
  })
  async findAllMunicipoByCodDeparamentoByCodArea(
    @Param('codDepartamento', ParseIntPipe) codDepartamento: number,
    @Param('codArea', ParseIntPipe) codArea: number,
  ) {
    return this._refEstructuraEstablecimientoService.findAllMunicipoByCodDeparamentoByCodArea(
      codDepartamento,
      codArea,
    );
  }

  @Get('establecimientos/:idSubsector/:idInstitucion/:codDepartamento/:codArea/:codMunicipio')
  @ApiOperation({
    summary: 'Listar Establecimientos',
  })
  async findAllEstablecimientoByCodDeparamentoByCodAreaByCodeMunicipio(
    @Param('idSubsector', ParseIntPipe) idSubsector: number,
    @Param('idInstitucion', ParseIntPipe) idInstitucion: number,
    @Param('codDepartamento', ParseIntPipe) codDepartamento: number,
    @Param('codArea', ParseIntPipe) codArea: number,
    @Param('codMunicipio', ParseIntPipe) codMunicipio: number,
  ) {
    return this._refEstructuraEstablecimientoService.findAllEstablecimientoByCodDeparamentoByCodAreaByCodeMunicipio(
      idSubsector,
      idInstitucion,
      codDepartamento,
      codArea,
      codMunicipio,
    );
  }

  @Get('depto-municipio/:codDepartamento/:idInstitucion/:idSubsector')
  @ApiOperation({
    summary: 'Listar Municipios por Departamento e Institucion',
  })
  async findAllMunicipioByCodigoDepartamento(
    @Param('codDepartamento', ParseIntPipe) codDepartamento: number,
    @Param('idInstitucion', ParseIntPipe) idInstitucion: number,
    @Param('idSubsector', ParseIntPipe) idSubsector: number,
  ) {
    return this._refEstructuraEstablecimientoService.findAllMunicipoByCodDeparamento(
      codDepartamento,
      idInstitucion,
      idSubsector
    );
  }

  @Get('municipio-red/:codMunicipio')
  @ApiOperation({
    summary: 'Listar Redes por Municipios',
  })
  async findAllRedByCodigoMunicipio(
    @Param('codMunicipio', ParseIntPipe) codMunicipio: number,
  ) {
    return this._refEstructuraEstablecimientoService.findAllRedByCodigoMunicipio(
      codMunicipio,
    );
  }

}
