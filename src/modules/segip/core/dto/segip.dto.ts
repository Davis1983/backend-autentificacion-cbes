import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SegipDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: `Carnet campo obligaorio`,
  })
  readonly numeroDocumento: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: `Fecha de nacimiento obligaoria`,
  })
  readonly fechaNacimiento: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: `complemento`,
  })
  readonly complento: string;
}
export class SegipRespDto {
  numeroDocumento: string;
  fechaNacimiento: string;
  complemento: string;
  complementoVisible: number;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  direccion: string;
}
