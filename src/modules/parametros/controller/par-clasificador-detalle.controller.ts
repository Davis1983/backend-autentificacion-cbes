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
import { ParClasificadorDetalleService } from '../services/impl/par-clasificador-detalle.service';
import { PaginationDto } from '../../../core/domain/dtos/pagination.dto';
import {
  CreateParClasificadorDetalleDto,
  UpdateParClasificadorDetalleDto,
} from '../core/domains/dtos/par-clasificador-detalle.dto';
import { RespuestaM } from '../../../core/domain/models/respuesta.model';
import { UpdateParClasificadorDto } from '../core/domains/dtos/par-clasificador.dto';

@ApiTags('Parametros - Par Clasificador Detalle')
@Controller('api/v1/clasificador-detalle/')
export class ParClasificadorDetalleController {
  constructor(
    private _parClasificadorDetalleService: ParClasificadorDetalleService,
  ) {}

  @Get('listar-detalle')
  @ApiOperation({
    summary:
      'Listar Clasificador Detalle si el dato va vacio se asigna un limit 10, ' +
      'si se desea paginar example clasificador/listar-detalle?limit=5&offset=2',
  })
  async findAllParClasificadorDetalle(@Query() paginadorDto: PaginationDto) {
    return await this._parClasificadorDetalleService.findAllParClasificadorDetalle(
      paginadorDto,
    );
  }
  @Post('create-clasificador')
  createParClasificadorDetalle(
    @Body() parClasificadorDetalleDto: CreateParClasificadorDetalleDto,
  ): Promise<RespuestaM> {
    return this._parClasificadorDetalleService.createParClasificadorDetalle(
      parClasificadorDetalleDto,
    );
  }

  @Get(':idClasificadorDetalle')
  findByIdParClasificadorDetalle(
    @Param('idClasificadorDetalle', ParseIntPipe)
    idClasificadorDetalle: number,
  ): Promise<RespuestaM> {
    return this._parClasificadorDetalleService.findByIdParClasificadorDetalle(
      idClasificadorDetalle,
    );
  }

  @Get('identificadorclasificador/:identificadorClasificador')
  findByIdentificadorClasificador(
    @Param('identificadorClasificador')
    identificadorClasificador: string,
  ): Promise<RespuestaM> {
    return this._parClasificadorDetalleService.findByIdentificadorClasificador(
      identificadorClasificador,
    );
  }

  @Put(':idClasificadorDetalle')
  @ApiOperation({
    summary: 'Modificar Par clasificador Detalle',
  })
  updateParClasificadorDetalle(
    @Param('idClasificadorDetalle', ParseIntPipe) idClasificadorDetalle: number,
    @Body() updateParClasificadorDetalle: UpdateParClasificadorDetalleDto,
  ) {
    updateParClasificadorDetalle.usuarioModificacion = 'luchisimo';
    return this._parClasificadorDetalleService.updateParClasificadorDetalle(
      idClasificadorDetalle,
      updateParClasificadorDetalle,
    );
  }
  @Patch('delete-logico/:idClasificadorDetalle')
  @ApiOperation({
    summary: 'Eliminacion Logica par clasificador detalle',
  })
  deleteLogicoParClasificadorDetalle(
    @Param('idClasificadorDetalle', ParseIntPipe) idClasificadorDetalle: number,
  ) {
    const usuario = 'nilo';
    return this._parClasificadorDetalleService.deleteLogicoParClasificadorDetalle(
      idClasificadorDetalle,
      usuario,
    );
  }

  @Delete(':idClasificadorDetalle')
  @ApiOperation({
    summary: 'Eliminacion id clasificador detalle',
  })
  deleteParClasificador(
    @Param('idClasificadorDetalle', ParseIntPipe) idClasificadorDetalle: number,
  ) {
    return this._parClasificadorDetalleService.deleteParClasificadorDetalle(
      idClasificadorDetalle,
    );
  }
}
