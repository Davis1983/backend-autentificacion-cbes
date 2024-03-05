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
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateAutPersonaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Nombre del tipo de recurso.` })
  readonly hash: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Número de carnet de identidad.` })
  readonly numeroDocumento: string;

  @IsString()
  @IsEmpty()
  @ApiProperty({ description: `Complemento para los carnets homónimos` })
  readonly complemento: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: `Switch para mostrar el complemento de un número de carnet`,
  })
  readonly complementoVisible: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Nombre completo de la persona.` })
  readonly nombres: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Primer Apellido de la persona.` })
  readonly primerApellido: string;

  @IsString()
  @IsEmpty()
  @ApiProperty({ description: `Segundo Apellido de la persona.` })
  readonly segundoApellido: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ description: `Fecha de nacimiento de la persona.` })
  readonly fechaNacimiento: Date;

  @IsString()
  @IsEmpty()
  @ApiProperty({
    description: `Lugar de expedición del carnet de identidad de la persona.`,
  })
  readonly expedicion: string;

  @IsDate()
  //@IsNotEmpty()
  @ApiProperty({ description: `Fecha de registro para eventos de CRUD.` })
  readonly fechaRegistro: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: `Usuario de aplicacion y/o Base de datos involucrado en eventos de CRUD.`,
  })
  readonly usuarioRegistro: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Dirección IP involucrada en eventos de CRUD.` })
  readonly ipRegistro: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: `Estado del Clasificador Baja/Activo.` })
  readonly bajaLogicaRegistro: boolean;

  @IsDate()
  //@IsEmpty()
  @ApiProperty({
    description: `Registro de Fecha de Modificación por el usuario.`,
  })
  readonly fechaModificacion: Date;

  @IsString()
  //@IsEmpty()
  @ApiProperty({
    description: `Username del Usuario que realizó la modificación.`,
  })
  readonly usuarioModificacion: string;
}

export class UpdateAutPersonaDto extends PartialType(CreateAutPersonaDto) {}
