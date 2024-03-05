import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete
} from '@nestjs/common';
import { AutUsuarioRestriccionService } from '../services/impl';
import {
  CreateAutUsuarioRestriccionDto,
  CreateUsuarioRestriccionIdPerfilesDto,
  UpdateAutUsuarioRestriccionDto,
  UpdateUsuarioRestriccionIdPerfilesDto,
} from '../core/domains/dtos/aut-usuario-restriccion.dto';
import { UpdateParClasificadorDto } from '../../parametros/core/domains/dtos/par-clasificador.dto';

@ApiTags('Autorizacion - Aut-UsuarioRestriccion')
@Controller('api/v1/aut-usuario-restriccion/')
export class AutUsuarioRestriccionController {
  constructor(
    private _autUsuarioRestriccionService: AutUsuarioRestriccionService,
  ) {}

  @Post('adicionar-perfiles/')
  @ApiOperation({
    summary: 'Adicionar Usuario-Restriccion-conPerfiles ',
  })
  async createAutUsuarioRestriccionPerfiles(
    @Body() dto: CreateUsuarioRestriccionIdPerfilesDto,
  ) {
    return await this._autUsuarioRestriccionService.createAutUsuarioRestriccionPerfiles(
      dto,
    );
  }

  @Put('update-usurestperfil/:idUsuarioRestriccion')
  @ApiOperation({
    summary: 'Modificar aut-usuario-restriccion con sus respectivos perfiles.',
  })
  updateUsuarioRestriccionByIdPerfil(
    @Param('idUsuarioRestriccion', ParseIntPipe) idUsuarioRestriccion: number,
    @Body() dto: UpdateUsuarioRestriccionIdPerfilesDto,
  ) {
    dto.usuarioModificacion = 'idusuario';
    return this._autUsuarioRestriccionService.updateAutUsuarioRestriccionPerfiles(
      idUsuarioRestriccion,
      dto,
    );
  }

  /*@Post('adicionar')
    @ApiOperation({
        summary:
            'Adicionar Usuario-Restriccion',
    })
    async createAutUsuarioRestriccion(@Body() createAutUsuarioRestriccion:CreateAutUsuarioRestriccionDto){
        return this._autUsuarioRestriccionService.createAutUsuarioRestriccion(createAutUsuarioRestriccion);
    }*/

  @Get(':usuario')
  @ApiOperation({
    summary: 'Buscar usuario',
  })
  async findByUsuario(@Param('usuario') usuario: string) {
    return this._autUsuarioRestriccionService.findUsuarioRestriccionByUsuario(
      usuario,
    );
  }

  @Get('restriccion-usuario/:usuario')
  @ApiOperation({
    summary: 'Buscar usuario',
  })
  async listarRestriccionesFindUsuario(@Param('usuario') usuario: string) {
    return this._autUsuarioRestriccionService.listarRestriccionesFindUsuario(
      usuario,
    );
  }
  @Delete(':idUsuarioRestriccion')
  @ApiOperation({
    summary: 'Eliminacion de la restriccion del usuario',
  })
  deleteUsuarioRestriccion(
    @Param('idUsuarioRestriccion', ParseIntPipe) idUsuarioRestriccion: number,
  ) {
    return this._autUsuarioRestriccionService.deleteUsuarioRestriccion(
      idUsuarioRestriccion,
    );
  }
}
