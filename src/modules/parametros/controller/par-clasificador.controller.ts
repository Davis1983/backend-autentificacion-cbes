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
import { ParClasificadorService } from '../services/impl/par-clasificador.service';
import {
  CreateParClasificadorDto,
  UpdateParClasificadorDto,
} from '../core/domains/dtos/par-clasificador.dto';
import { RespuestaM } from '../../../core/domain/models/respuesta.model';
import { PaginationDto } from '../../../core/domain/dtos/pagination.dto';

@ApiTags('Parametros - Par Clasificador')
@Controller('api/v1/clasificador/')
export class ParClasificadorController {
  constructor(private _parClasificadorService: ParClasificadorService) {}

  @Get('listar')
  @ApiOperation({
    summary:
      'Listar Clasificador si el dato va vacio se asigna un limit 10, ' +
      'si se desea paginar example clasificador/listar?limit=5&offset=2',
  })
  async findAllParClasificador(@Query() paginadorDto: PaginationDto) {
    return await this._parClasificadorService.findAllParClasificador(
      paginadorDto,
    );
  }

  @Get(':clasificadorId')
  @ApiOperation({
    summary: 'Buscar el clasificador por id',
  })
  getOne(
    @Param('clasificadorId', ParseIntPipe) clasificadorId: number,
  ): Promise<RespuestaM> {
    return this._parClasificadorService.findOne(clasificadorId);
  }

  @Get('identificador/:identificadorClasificador')
  @ApiOperation({
    summary:
      'Buscar el clasificador por el nombre del clasificador exammple clasificador/identificador/TIPO_USUARIO',
  })
  getOneIdentificadorClasificador(
    @Param('identificadorClasificador') identificadorClasificador: string,
  ): Promise<RespuestaM> {
    return this._parClasificadorService.findOneIdentificadorClasificador(
      identificadorClasificador,
    );
  }
  @Post()
  @ApiOperation({
    summary: 'Crear clasificador',
  })
  create(@Body() payload: CreateParClasificadorDto): Promise<RespuestaM> {
    return this._parClasificadorService.createParClasificador(payload);
  }

  @Put(':idClasificador')
  @ApiOperation({
    summary: 'Modificar clasificador',
  })
  updateParClasificador(
    @Param('idClasificador', ParseIntPipe) idClasificador: number,
    @Body() updateParClasificador: UpdateParClasificadorDto,
  ) {
    updateParClasificador.usuarioModificacion = 'idusuario';
    return this._parClasificadorService.updateParClasificador(
      idClasificador,
      updateParClasificador,
    );
  }
  @Patch('delete-logico/:idClasificador')
  @ApiOperation({
    summary: 'Eliminacion Logica clasificador',
  })
  deleteLogicoParClasificador(
    @Param('idClasificador', ParseIntPipe) idClasificador: number,
  ) {
    const usuario = 'nilo';
    return this._parClasificadorService.deleteLogicoParClasificador(
      idClasificador,
      usuario,
    );
  }

  @Delete(':idClasificador')
  @ApiOperation({
    summary: 'Eliminacion id clasificador',
  })
  deleteParClasificador(
    @Param('idClasificador', ParseIntPipe) idClasificador: number,
  ) {
    return this._parClasificadorService.deleteParClasificador(idClasificador);
  }
}
