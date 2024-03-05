import { PaginationDto } from '../../../core/domain/dtos/pagination.dto';

export interface ParGrupoProfesionServiceInterface {
  findAllGrupoProfesion(paginadorDto: PaginationDto): Promise<any>;
}
