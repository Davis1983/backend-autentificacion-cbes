import { plainToClass } from 'class-transformer';
import { AutUsuarioPerfilM } from '../core/domains/models/aut-usuario-perfil.model';
import { AutUsuarioPerfilMDto } from '../core/domains/dtos/aut-usuario-perfil.dto';

export const AutUsuarioPerfilMMapper_EntitiesToDto = (
  item: AutUsuarioPerfilM,
): AutUsuarioPerfilMDto => {
  const autUsuarioPerfilDto = plainToClass(AutUsuarioPerfilMDto, item, {
    excludeExtraneousValues: true,
  });
  return autUsuarioPerfilDto;
};

export const AutUsuarioPerfilMapper_EntitiesToDtos = (
  items: AutUsuarioPerfilM[],
): AutUsuarioPerfilMDto[] => {
  return items.map((item) => AutUsuarioPerfilMMapper_EntitiesToDto(item));
};