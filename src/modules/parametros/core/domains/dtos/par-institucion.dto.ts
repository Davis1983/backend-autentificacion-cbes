import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CreateParSistemaDto } from './par-sistema.dto';

export class CreateParInstitucionDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  @ApiProperty({ description: `Campo obligatorio - id Grupo Institucion` })
  idGrupoInstitucion: number;

  @IsNotEmpty()
  @IsString()
  @Expose()
  @ApiProperty({ description: 'Campo obligatorio - Nombre Institucion' })
  nombreInstitucion: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  @ApiProperty({ description: 'Campo obligatorio - Sigla Institucion' })
  siglaInstitucion: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  @ApiProperty({ description: 'Campo obligatorio - Descripcion Institucion' })
  descripcionInstitucion: string;

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

export class UpdateParInstitucionDto extends PartialType(
  CreateParInstitucionDto,
) {}
