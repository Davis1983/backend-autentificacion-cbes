import { PaginationDto } from '../../../core/domain/dtos/pagination.dto';
import { RespuestaM } from '../../../core/domain/models/respuesta.model';
import {
  CreateParClasificadorDto,
  UpdateParClasificadorDto,
} from '../core/domains/dtos/par-clasificador.dto';

export interface ParClasificadorServiceInterface {
  findAllParClasificador(paginadorDto: PaginationDto): Promise<RespuestaM>;

  findOne(id: number): Promise<RespuestaM>;

  findOneIdentificadorClasificador(
    identificadorClasificador: string,
  ): Promise<RespuestaM>;

  createParClasificador(data: CreateParClasificadorDto): Promise<RespuestaM>;

  updateParClasificador(
    idClasificador: number,
    updateParClasificador: UpdateParClasificadorDto,
  ): Promise<RespuestaM>;

  deleteLogicoParClasificador(
    idClasificador: number,
    usuario: string,
  ): Promise<RespuestaM>;

  deleteParClasificador(idClasificador: number): Promise<RespuestaM>;
}
