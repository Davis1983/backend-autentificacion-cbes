import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateParSistemaDto {
  @IsNotEmpty()
  @IsString()
  @Expose()
  @ApiProperty({ description: 'Campo Obligatorio - identificador sistema' })
  identificadorSistema: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  @ApiProperty({ description: 'Campo Obligatorio - Nombre Sistema' })
  nombreSistema: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  @ApiProperty({ description: 'Campo Obligatorio - Descripcion Sistema' })
  descripcionSistema: string;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  fechaRegistro: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  usuarioRegistro: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  ipRegistro: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  bajaLogicaRegistro: boolean;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  fechaModificacion: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  usuarioModificacion: string;
}

export class UpdateParSistemaDto extends PartialType(CreateParSistemaDto) {}
