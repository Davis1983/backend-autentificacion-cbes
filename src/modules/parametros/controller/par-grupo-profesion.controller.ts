import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ParGrupoProfesionService } from '../services/impl/par-grupo-profesion.service';
import {
  CreateParGrupoProfesionDto,
  UpdateParGrupoProfesionDto,
} from '../core/domains/dtos/par-grupo-profesion.dto';
import { RespuestaM } from '../../../core/domain/models/respuesta.model';
import { PaginationDto } from '../../../core/domain/dtos/pagination.dto';

@ApiTags('Parametros - Grupo Profesión')
@Controller('api/v1/grupo-profesion/')
export class ParGrupoProfesionController {
  constructor(private _parGrupoProfesionService: ParGrupoProfesionService) {}

  @Get('listar-grupo-profesion')
  @ApiOperation({ summary: 'Lista del Grupo Profesion' })
  async findAllGrupoProfesion(@Query() paginadorDto: PaginationDto) {
    return await this._parGrupoProfesionService.findAllGrupoProfesion(
      paginadorDto,
    );
  }

  @Get(':idGrupoProfesion')
  @ApiOperation({
    summary: 'Busqueda de Grupo Profesión por idGrupoProfesion.',
  })
  getOne(
    @Param('idGrupoProfesion', ParseIntPipe) idGrupoProfesion: number,
  ): Promise<RespuestaM> {
    return this._parGrupoProfesionService.findOne(idGrupoProfesion);
  }

  @Post()
  @ApiOperation({ summary: 'Método para crear un Grupo Profesión.' })
  create(@Body() payload: CreateParGrupoProfesionDto) {
    return this._parGrupoProfesionService.create(payload);
  }

  @Put(':idGrupoProfesion')
  @ApiOperation({ summary: 'Método para actualizar un Grupo Profesión.' })
  update(
    @Param('idGrupoProfesion') id: number,
    @Body() payload: UpdateParGrupoProfesionDto,
  ) {
    return this._parGrupoProfesionService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Método para dar de baja un Grupo Profesión.' })
  delete(@Param('id') id: number) {
    return this._parGrupoProfesionService.remove(id);
  }

  @Patch('delete-logico/:idGrupoProfesion')
  @ApiOperation({
    summary: 'Eliminacion Par Grupo Profesion',
  })
  deleteLogicoParClasificador(
    @Param('idGrupoProfesion', ParseIntPipe) idGrupoProfesion: number,
  ) {
    const usuario = 'nilo';
    return this._parGrupoProfesionService.deleteLogicoParGrupoProfesion(
      idGrupoProfesion,
      usuario,
    );
  }
}
