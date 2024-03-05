import {PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAutProfesionPersonaDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ description: `Id Persona` })
  idPersona: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ description: `Id grupo profesion` })
  idGrupoProfesion: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Matricula Profesional` })
  matriculaProfesional: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: `Certificador` })
  certificador: boolean;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({ description: `Fecha Registro` })
  fechaRegistro: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: `Usuario Registro` })
  usuarioRegistro: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: `Ip registro` })
  ipRegistro: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: `Baja logica de registro` })
  bajaLogicaRegistro: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: `Fecha modificacion` })
  fechaModificacion: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: `Usuario Modificacion` })
  usuarioModificacion: string;
}
export class UpdateAutProfesionPersonaDto extends PartialType(CreateAutProfesionPersonaDto) {}
