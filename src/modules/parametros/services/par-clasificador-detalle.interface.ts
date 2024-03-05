import { PaginationDto } from '../../../core/domain/dtos/pagination.dto';
import { RespuestaM } from '../../../core/domain/models/respuesta.model';
import {
  CreateParClasificadorDetalleDto,
  UpdateParClasificadorDetalleDto,
} from '../core/domains/dtos/par-clasificador-detalle.dto';

export interface ParClasificadorDetalleInterface {
  findAllParClasificadorDetalle(
    paginadorDto: PaginationDto,
  ): Promise<RespuestaM>;

  createParClasificadorDetalle(
    parClasificadorDetalleDto: CreateParClasificadorDetalleDto,
  ): Promise<RespuestaM>;

  findByIdParClasificadorDetalle(
    idClasificadorDetalle: number,
  ): Promise<RespuestaM>;

  findByIdentificadorClasificador(
    identificadorClasificador: string,
  ): Promise<RespuestaM>;

  updateParClasificadorDetalle(
    idClasificadorDetalle: number,
    updateParClasificadorDetalle: UpdateParClasificadorDetalleDto,
  ): Promise<RespuestaM>;

  deleteLogicoParClasificadorDetalle(
    idClasificadorDetalle: number,
    usuario: string,
  ): Promise<RespuestaM>;

  deleteParClasificadorDetalle(
    idClasificadorDetalle: number,
  ): Promise<RespuestaM>;
}
