import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  IsDate,
  IsEmpty,
  IsBoolean,
} from 'class-validator';
import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateParTipoRecursoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: `Campo Obligatorio - Nombre del tipo de recurso.`,
  })
  readonly nombreTipoRecurso: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: `Campo Obligatorio - Descripción del tipo de recurso.`,
  })
  readonly descripcionTipoRecurso: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: `Campo Obligatorio - Plataforma del tipo de recurso. (Web, Servicio, Escritorio, Movil)`,
  })
  readonly plataforma: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: `Campo Obligatorio - Formato del tipo de recurso.`,
  })
  readonly formato: string;

  @IsDate()
  //@IsNotEmpty()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  readonly fechaRegistro: Date;

  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  readonly usuarioRegistro: string;

  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  readonly ipRegistro: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  bajaLogicaRegistro: boolean;

  @IsDate()
  //@IsEmpty()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  readonly fechaModificacion: Date;

  @IsString()
  //@IsEmpty()
  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  usuarioModificacion: string;
}

export class UpdateParTipoRecursoDto extends PartialType(
  CreateParTipoRecursoDto,
) {}
