/*
@Get(':clasificadorId')
  @ApiOperation({
    summary: 'Buscar el clasificador por id',
  })
  getOne(
    @Param('clasificadorId', ParseIntPipe) clasificadorId: number,
  ): Promise<RespuestaM> {
    return this._parClasificadorService.findOne(clasificadorId);
  }
 */

import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { RespuestaM } from '../../../core/domain/models/respuesta.model';
import { ApiTags } from '@nestjs/swagger';
import { SegipDto } from '../core/dto/segip.dto';
import { SegipService } from '../services/impl/segip.service';
@ApiTags('Verificador Segip')
@Controller('api/v1/segip/')
export class SegipController {
  constructor(private segipService: SegipService) {}
  @Get('segip')
  findByIdAutPerfil(@Query() segip: SegipDto) {
    return this.segipService.findBySegip(segip);
  }
}
