import { plainToClass } from 'class-transformer';
import { AutPersonaUsuarioM } from '../core/domains/models/aut-persona-usuario.model';
import { AutPersonaUsuarioMDto } from '../core/domains/dtos/aut-persona-usuario.dto';

export const AutPersonaUsuarioMMapper_EntitiesToDto = (
  item: AutPersonaUsuarioM,
): AutPersonaUsuarioMDto => {
  const autPersonaUsuarioDto = plainToClass(AutPersonaUsuarioMDto, item, {
    excludeExtraneousValues: true,
  });
  return autPersonaUsuarioDto;
};

export const AutPersonaUsuarioMapper_EntitiesToDtos = (
  items: AutPersonaUsuarioM[],
): AutPersonaUsuarioMDto[] => {
  return items.map((item) => AutPersonaUsuarioMMapper_EntitiesToDto(item));
};
