import {IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean, IsArray} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class CreateAutUsuarioRestriccionPerfil {

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ description: `identificador de la tabla aut_usuario_restriccion ` })
  idUsuarioRestriccion: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ description: `Identificador de perfil` })
  idPerfil: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'fecha de registro',
  })
  fechaRegistro: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `usuario registro` })
  usuarioRegistro: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `ip registro` })
  ipRegistro: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: `Estado de la eliminación lógica del registro.`})
  bajaLogicaRegistro: boolean;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'fecha de modificacion',
  })
  fechaModificacion: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'usuario de modificacion',
  })
  usuarioModificacion: string;
}

export class UpdateAutUsuarioRestriccionPerfil extends PartialType(CreateAutUsuarioRestriccionPerfil) {}

export class CreateAutusuarioRestriccionPerfilArray{
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ description: `identificador de la tabla aut_usuario_restriccion ` })
  readonly idUsuarioRestriccion: number;

  @IsArray()
  //@IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ description: `Identificador de perfil` })
  readonly idPerfil: number[];
}
