import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  IsDate,
  IsEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateParClasificadorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: `Campo Obligatorio - Identificador unico de la tabla clasificador - camp`,
  })
  readonly identificadorClasificador: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: `Campo Obligatorio - Descripción del clasificador`,
  })
  readonly descripcionClasificador: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  readonly usuarioRegistro: string;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  readonly fechaRegistro: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  readonly ipRegistro: string;

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
  readonly fechaModificacion: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  usuarioModificacion: string;
}

export class UpdateParClasificadorDto extends PartialType(
  CreateParClasificadorDto,
) {}
