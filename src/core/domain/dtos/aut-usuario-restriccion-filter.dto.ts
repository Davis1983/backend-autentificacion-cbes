import {
  IsOptional,
  IsPositive,
  IsNumber,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AutUsuarioRestriccionFilterDto {
  @Expose()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ description: `identificador del Sistema ` })
  idSistema?: number;

  @Expose()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ description: `Identificador de la Institución` })
  idInstitucion?: number;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({ description: `Identificador del Sub sector` })
  idSubsector?: number;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({
    description: `idc nivel, tipo de usuario: Nacional, Sedes, Establecimiento, etc`,
  })
  idcNivel?: string;

  @Expose()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ description: `codigo departamento` })
  codDepartamento?: number;

  @Expose()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ description: `codigo area` })
  codArea?: number;

  @Expose()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ description: `cod municipio` })
  codMunicipio?: number;

  @Expose()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ description: `cod establecimiento` })
  codEstablecimiento?: number;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({
    description: `nombre de usuario`,
  })
  usuario?: string;
}
