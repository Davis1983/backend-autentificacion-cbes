import { PaginationDto } from '../../../core/domain/dtos/pagination.dto';
import { RespuestaM } from '../../../core/domain/models/respuesta.model';
import { CreateAutPersonaDto } from '../core/domains/dtos/aut-persona.dto';

export interface AutPersonaServiceInterface {
  findOne(id: number): Promise<RespuestaM>;
  createAutPersona(data: CreateAutPersonaDto): Promise<RespuestaM>;
}
