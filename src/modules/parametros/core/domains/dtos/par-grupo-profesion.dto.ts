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

export class CreateParGrupoProfesionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: `Campo Obligatorio - Nombre del Grupo Profesión`,
  })
  readonly nombreGrupoProfesion: string;

  @IsString()
  @IsEmpty()
  @ApiProperty({
    description: `Campo Obligatorio - Descripción del Grupo Profesión`,
  })
  readonly nombreDescripcionProfesion: string;

  @IsString()
  @IsEmpty()
  @ApiProperty({
    description: `Campo Obligatorio - Detalle del Tipo de Registro del Grupo Profesión`,
  })
  readonly tipoRegistro: string;

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

  @ApiPropertyOptional({
    description: 'se asigna de manera automatica no agregar datos',
  })
  ipRegistro: string;

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

export class UpdateParGrupoProfesionDto extends PartialType(
  CreateParGrupoProfesionDto,
) {}
