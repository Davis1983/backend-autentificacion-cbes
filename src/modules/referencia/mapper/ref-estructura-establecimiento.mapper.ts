import { plainToClass } from "class-transformer";
import { RefEstructuraEstablecimientoM } from "../core/domains/models/ref-estructura-establecimiento.model";
import { RefEstructuraEstablecimientoMDto } from "../core/domains/dtos/ref-estructura-establecimiento.dto";

export const RefEstructuraEstablecimientoMMapper_EntitiesToDto = (
  item: RefEstructuraEstablecimientoM,
): RefEstructuraEstablecimientoMDto => {
  const refEstructuraEstablecimientoMDto = plainToClass(RefEstructuraEstablecimientoMDto, item, {
    excludeExtraneousValues: true,
  });
  return refEstructuraEstablecimientoMDto;
};

export const RefEstructuraEstablecimientoMapper_EntitiesToDtos = (
  items: RefEstructuraEstablecimientoM[],
): RefEstructuraEstablecimientoMDto[] => {
  return items.map((item) => RefEstructuraEstablecimientoMMapper_EntitiesToDto(item));
};
