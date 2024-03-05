import { plainToClass } from 'class-transformer';
import { AutUsuarioPerfilRecursoM } from '../core/domains/models/aut-usuario-perfil-recurso.model';
import { AutUsuarioPerfilRecursoMDto } from '../core/domains/dtos/aut-usuario-perfil-recurso.dto';

export const AutUsuarioPerfilRecursoMMapper_EntitiesToDto = (
  item: AutUsuarioPerfilRecursoM,
): AutUsuarioPerfilRecursoMDto => {
  const autUsuarioPerfilRecursoDto = plainToClass(AutUsuarioPerfilRecursoMDto, item, {
    excludeExtraneousValues: true,
  });
  return autUsuarioPerfilRecursoDto;
};

export const AutUsuarioPerfilRecursoMapper_EntitiesToDtos = (
  items: AutUsuarioPerfilRecursoM[],
): AutUsuarioPerfilRecursoMDto[] => {
  return items.map((item) => AutUsuarioPerfilRecursoMMapper_EntitiesToDto(item));
};