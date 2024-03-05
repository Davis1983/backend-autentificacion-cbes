// import { PaginationDto } from '../../../core/domain/dtos/pagination.dto';
import { AutUsuarioRestriccionFilterDto } from 'src/core/domain/dtos/aut-usuario-restriccion-filter.dto';
import { RespuestaM } from '../../../core/domain/models/respuesta.model';
export interface AutUsuarioServiceInterface{
    findAllAutUsuario(autUsuarioRestriccionFilter: AutUsuarioRestriccionFilterDto): Promise<RespuestaM>;
}