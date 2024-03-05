import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Patch,
  Put,
} from '@nestjs/common';
import { PaginationDto } from '../../../core/domain/dtos/pagination.dto';
import { AutPerfilService } from '../services/impl';
import { RespuestaM } from '../../../core/domain/models/respuesta.model';

import {
  CreateAutPerfilDto,
  UpdateAutPerfilDto,
  CreateUpdateAutPerfilDto, ContextoDto
} from "../core/domains/dtos/aut-perfil.dto";
import { FindUsuariosDto } from "../core/domains/dtos/aut-usuario-restriccion.dto";

@ApiTags('Autorizacion - Aut-Perfil')
@Controller('api/v1/aut-perfil/')
export class AutPerfilController {
  constructor(private _autPerfilService: AutPerfilService) {}
  @Get('listar')
  @ApiOperation({
    summary:
      'Listar Aut-Perfil si el dato va vacio se asigna un limit 10, ' +
      'si se desea paginar example aut-pefil/listar?limit=5&offset=2',
  })
  async findAllAutPerfil(@Query() paginadorDto: PaginationDto) {
    return this._autPerfilService.findAllAutPerfil(paginadorDto);
  }

  @Get(':idAutPerfil')
  findByIdAutPerfil(
    @Param('idAutPerfil', ParseIntPipe)
    idAutPerfil: number,
  ): Promise<RespuestaM> {
    return this._autPerfilService.findByIdAutPerfil(idAutPerfil);
  }

  @Get('sistema/:idSistema')
  findByIdAutPerfilByIdSistema(
    @Param('idSistema', ParseIntPipe)
    idSistema: number,
  ): Promise<RespuestaM> {
    return this._autPerfilService.findByIdAutPerfilByIdSistema(idSistema);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear Aut Perfil',
  })
  create(@Body() createAutPerfil: CreateUpdateAutPerfilDto): Promise<RespuestaM> {
    return this._autPerfilService.createAutPerfil(createAutPerfil);
  }

  @Post('aut-perfil-recurso/:idPerfil')
  @ApiOperation({
    summary: 'Insertar y modificar Aut Perfil y Recursos asignados',
  })
  createUpdateAutPerfil(@Param('idPerfil', ParseIntPipe) idPerfil: number, @Body() dto: CreateUpdateAutPerfilDto): Promise<RespuestaM> {
    console.log("dto input", dto);
    return this._autPerfilService.createUpdateAutPerfil(idPerfil, dto);
  }

  @Put(':idPerfil')
  @ApiOperation({
    summary: 'Modificar Aut perfil ',
  })
  updateAutPerfil(
    @Param('idPerfil', ParseIntPipe) idPerfil: number,
    @Body() updateAutPerfil: CreateUpdateAutPerfilDto,
  ) {
    updateAutPerfil.usuarioModificacion = 'luchisimo';
    return this._autPerfilService.updateAutPerfil(idPerfil, updateAutPerfil);
  }

  @Patch('delete-logico/:idPerfil')
  @ApiOperation({
    summary: 'Eliminacion Logica Aut perfil',
  })
  deleteLogicoAutPerfil(@Param('idPerfil', ParseIntPipe) idPerfil: number) {
    const usuario = '---';
    return this._autPerfilService.deleteLogicoAutPerfil(idPerfil, usuario);
  }

  @Get('aut-perfil-recurso/:idPerfil/:idSistema')
  @ApiOperation({
    summary:
      'Lista los recursos asignados al perfil por id_perfil, id_sistema ',
  })
  listarAutRecursoByIdPerfil(
    @Param('idPerfil', ParseIntPipe) idPerfil: number,
    @Param('idSistema', ParseIntPipe) idSistema: number,
  ): Promise<RespuestaM> {
    return this._autPerfilService.listarAutRecursoByIdPerfil(
      idPerfil,
      idSistema,
    );
  }

  @Get('aut-perfil-sistema/:idSistema')
  @ApiOperation({
    summary:
        'Lista perfiles por idSistema ',
  })
  listarPerfilByIdSistema(
      @Param('idSistema', ParseIntPipe) idSistema: number,
  ){
    return this._autPerfilService.listarPerfilByIdSistema(
        idSistema,
    );
  }

  @Get('aut-perfil-sistema/:idSistema/:idPerfil')
  @ApiOperation({
    summary:
        'Lista perfiles por idSistema y idPerfil ',
  })
  listarPerfilByIdSistemaByIdPerfil(
      @Param('idSistema', ParseIntPipe) idSistema: number,
      @Param('idPerfil', ParseIntPipe) idPerfil: number,
  ){
    return this._autPerfilService.listarPerfilByIdSistemaByIdPerfil(
        idSistema,idPerfil
    );
  }

  @Get('aut-usuario-perfil/:idSistema/:usuario')
  @ApiOperation({
    summary:
      'Lista los perfiles asignados al usuario por id_sistema y usuario ',
  })
  listarAutUsuarioPerfilByIdSistema(
    @Param('idSistema', ParseIntPipe) idSistema: number,
    @Param('usuario') usuario: string,
  ): Promise<RespuestaM> {
    return this._autPerfilService.listarUsuarioPerfilByIdSistema(
      idSistema,
      usuario
    );
  }

  @Get('aut-usuario-perfil/:idSistema/:idUsuarioRestriccion')
  @ApiOperation({
    summary:
        'Lista los perfiles asignados al usuario por id_sistema y id usuario restriccion ',
  })
  listarAutUsuarioPerfilByIdSistemaByIdUsuarioRestriccion(
      @Param('idSistema', ParseIntPipe) idSistema: number,
      @Param('idUsuarioRestriccion', ParseIntPipe) idUsuarioRestriccion: number,
  ): Promise<RespuestaM> {
    return this._autPerfilService.listarUsuarioPerfilByIdSistemaByIdUsuarioRestriccion(
        idSistema,
        idUsuarioRestriccion
    );
  }

  @Post('autorizacion/contexto')
  @ApiOperation({
    summary:
      'Contexto Lista los recursos asignados al perfil por usuario',
  })
  listarPerfilRecursoByUsuario(
    @Param('idSistema') idSistema: number,
    @Param('usuario') usuario: string,
    @Body() dto:ContextoDto
  ): Promise<RespuestaM> {
    return this._autPerfilService.listarPerfilRecursoByUsuario(
      dto
    );
  }

  @Post('aut-usuario-find-all')
  @ApiOperation({
    summary:
      'perfiles asignados al usuario',
  })
  usuarioFindByIdAll(
    /*@Param('idSistema') idSistema: number,
    @Param('usuario') usuario: string,*/
    @Body() dto:FindUsuariosDto
  ): Promise<RespuestaM> {
    return this._autPerfilService.usuarioFindByIdAll(
      dto
    );
  }
}
