import { plainToClass } from 'class-transformer';
import { AutRecursoM } from '../core/domains/models/aut-recurso.model';
import { AutRecursoMDto } from '../core/domains/dtos/aut-recurso.dto';

export const AutRecursoMMapper_EntitiesToDto = (
  item: AutRecursoM,
): AutRecursoMDto => {
  const autRecursoDto = plainToClass(AutRecursoMDto, item, {
    excludeExtraneousValues: true,
  });
  return autRecursoDto;
};

export const AutRecursoMapper_EntitiesToDtos = (
  items: AutRecursoM[],
): AutRecursoMDto[] => {
  return items.map((item) => AutRecursoMMapper_EntitiesToDto(item));
};