import { plainToClass } from 'class-transformer';
import { AutPerfilRecursoM } from '../core/domains/models/aut-perfil-recurso.model';
import { AutPerfilRecursoMDto } from '../core/domains/dtos/aut-perfil-recurso.dto';

export const AutPerfilRecursoMMapper_EntitiesToDto = (
  item: AutPerfilRecursoM,
): AutPerfilRecursoMDto => {
  const autPerfilRecursoDto = plainToClass(AutPerfilRecursoMDto, item, {
    excludeExtraneousValues: true,
  });
  return autPerfilRecursoDto;
};

export const AutPerfilRecursoMapper_EntitiesToDtos = (
  items: AutPerfilRecursoM[],
): AutPerfilRecursoMDto[] => {
  return items.map((item) => AutPerfilRecursoMMapper_EntitiesToDto(item));
};
