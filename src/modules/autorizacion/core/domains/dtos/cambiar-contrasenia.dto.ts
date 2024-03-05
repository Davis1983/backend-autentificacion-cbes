import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsBoolean,
    IsOptional
  } from 'class-validator';
  import { PartialType, ApiProperty } from '@nestjs/swagger';
  
  export class CambiarContraseniaDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(200)
    @ApiProperty({ description: `Contraseña del usuario` })
    contrasenia: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(200)
    @ApiProperty({ description: `Contraseña del usuario` })
    contraseniaNueva: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(200)
    @ApiProperty({ description: `Contraseña del usuario` })
    confirmaContrasenia : string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ description: `Identificador para determinar si la contraseña fue reseteada.`})
    contraseniaReset: boolean;
  }

  export class UpdateCambiarContraseniaDto extends PartialType(CambiarContraseniaDto) {}
