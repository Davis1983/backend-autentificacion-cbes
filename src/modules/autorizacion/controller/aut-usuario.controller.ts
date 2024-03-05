import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  DefaultValuePipe,
  Query,
  Put,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AutUsuarioService } from '../services/impl/aut-usuario.service';
import { RespuestaM } from '../../../core/domain/models/respuesta.model';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AutUsuario } from '../core/domains/entities/aut-usuario.entity';
import { PaginationDto } from '../../../core/domain/dtos/pagination.dto';
import { AutUsuarioRestriccionFilterDto } from 'src/core/domain/dtos/aut-usuario-restriccion-filter.dto';
import { AuthGuard } from 'src/modules/auth/services/auth.guard';
import { CreateAutUsuarioDto } from '../core/domains/dtos';
import { ContextoDto } from '../core/domains/dtos';

@ApiTags('Autorizacion - Aut-Usuario')
//Control de ingreso al controlador
//@UseGuards(AuthGuard)
@Controller('api/v1/aut-usuario/')
export class AutUsuarioController {
  constructor(private _autUsuarioService: AutUsuarioService) {}

  /*@Get('listar')
  async findAllAutUsuario() {
    return await this._autUsuarioService.findAllAutUsuario();
  }*/

  @Post('adicionar')
  @ApiOperation({
    summary: 'Adicionar Usuario',
  })
  async createAutUsuario(@Body() createAutUsuario: CreateAutUsuarioDto) {
    return this._autUsuarioService.createAutUsuario(createAutUsuario);
  }
  @Get('listar')
  @ApiOperation({
    summary:
      'Listar usuarios si el dato es vacio se asigna un paginado de 10 registros, ' +
      'si se desea paginar example usuarios/listar?limit=5&offset=2',
  })
  async findAllAutUsuario(
    @Query() autUsuarioRestriccionFilterDto: AutUsuarioRestriccionFilterDto,
  ) {
    return await this._autUsuarioService.findAllAutUsuario(
      autUsuarioRestriccionFilterDto,
    );
  }

  //Nilo
  @Get('listarExcel')
  @ApiOperation({
    summary:
      'Generar un archivo excel con la lista de usuarios,',
  })
  async listarExcel(
    @Query() autUsuarioRestriccionFilterDto: AutUsuarioRestriccionFilterDto,
  ) {
    return await this._autUsuarioService.listarExcel(
      autUsuarioRestriccionFilterDto,
    );
  }
  //Nilo

  @Get('reporte-usuarios')
  @ApiOperation({
    summary: 'reporte usuarios',
  })
  async reporteUsuarios() {
    return this._autUsuarioService.reporteUsuario();
  }

  @Get('listar-usuarios')
  @ApiOperation({
    summary: 'reporte usuarios',
  })
  async listarReporteUsuarios() {
    return this._autUsuarioService.listarUsuarioReporte();
  }

  @Get(':idPersona')
  getOne(
    @Param('idPersona', ParseIntPipe) idPersona: number,
  ): Promise<RespuestaM> {
    return this._autUsuarioService.findOne(idPersona);
  }
  @Get('usuario/:usuario')
  findByUsuario(@Param('usuario') usuario: string): Promise<RespuestaM> {
    return this._autUsuarioService.findUsuario(usuario);
  }

  @Post('usuarioAll/:usuario')
  findByUsuarioAllRelations(
    @Param('usuario') usuario: string,
  ): Promise<RespuestaM> {
    return this._autUsuarioService.findByUsuarioAllRelations(usuario);
  }

  @Post('autorizacion/contexto')
  @ApiOperation({
    summary: 'Contexto Lista los recursos asignados al perfil por usuario',
  })
  listarPerfilRecursoByUsuario(
    /*@Param('idSistema') idSistema: number,
    @Param('usuario') usuario: string,*/
    @Body() dto: ContextoDto,
  ) {
    return this._autUsuarioService.listarPerfilRecursoByUsuario(dto);
  }

  @Patch('delete-logico/:idPersona/:usuario')
  @ApiOperation({
    summary: 'Eliminacion Logica par clasificador detalle',
  })
  deleteLogicoParClasificadorDetalle(
    @Param('idPersona', ParseIntPipe) idPersona: number,
    @Param('usuario') usuario: string,
  ) {
    return this._autUsuarioService.deleteLogicoUsuario(
      idPersona,
      usuario,
    );
  }
}
