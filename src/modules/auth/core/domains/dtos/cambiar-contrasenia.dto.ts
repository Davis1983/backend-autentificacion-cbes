import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsOptional,
    IsBoolean,
    Matches
  } from 'class-validator';
  import { PartialType, ApiProperty } from '@nestjs/swagger';
  
  export class CambiarContraseniaDto {
    
    @IsString({ message: "La contraseña debe contener caractéres validos" })
    @MinLength(6)
    @MaxLength(50)
    @IsNotEmpty({ message: "La contraseña es un campo requerido" })
    /** Expresión regular para una contraseña segura */
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: "La contraseña debe tener letas mayúsculas, minusculas y numeros",
    })
    @ApiProperty({ description: `Contraseña del usuario` })
    contrasenia: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(200)
    @ApiProperty({ description: `Contraseña del usuario` })
    contraseniaActual: string;

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

    @IsString()
    @IsOptional()
    @ApiProperty({ description: `Token para la restauracion del password` })
    token : string;
  }

  export class UpdateCambiarContraseniaDto extends PartialType(CambiarContraseniaDto) {}
