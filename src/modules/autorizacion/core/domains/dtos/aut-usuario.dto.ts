import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  IsDate,
  IsEmpty,
  IsBoolean,
  IsEmail, IsOptional
} from "class-validator";
  import { PartialType, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

  export class CreateAutUsuarioDto {

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: `id se genera en el back` })
    idPersona: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: `Nombre de usuario.` })
    usuario: string;

    // @IsString()
    // @IsOptional()
    // @ApiProperty({ description: `Clasificador del nivel de usuario` })
    // idcNivel: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: `Contraseña del usuario` })
    contrasenia: string;

    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional({ description: `Identificador para determinar si la contraseña fue reseteada.`})
    contraseniaReset: boolean;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: `Clasificador tipo de usuario.` })
    idcTipoUsuario: string;

    // @IsNumber()
    // @IsOptional()
    // @ApiProperty({ description: `Código de institución.` })
    // idInstitucion: number;

    @IsEmail()
    @IsOptional()
    @ApiProperty({ description: `Correo electrónico.` })
    correoElectronico: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: `Teléfono fijo o celular.`})
    telefono: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: `Clasificador del estado usuario.` })
    idcEstado: string;

    @IsDate()
    @IsOptional()
    @ApiProperty({ description: `Fecha de registro para eventos de CRUD.`})
    fechaRegistro: Date;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: `Usuario de aplicacion y/o Base de datos involucrado en eventos de CRUD.`})
    usuarioRegistro: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: `Dirección IP involucrada en eventos de CRUD.`})
    ipRegistro: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ description: `Estado del Clasificador Baja/Activo.`})
    bajaLogicaRegistro: boolean;

    @IsDate()
    @IsOptional()
    @ApiProperty({ description: `Registro de Fecha de Modificación por el usuario.`})
    fechaModificacion: Date;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: `Username del Usuario que realizó la modificación.`})
    usuarioModificacion: string;

  }

  export class CreateUsuarioInicialDto{
  }
  export class UpdateAutUsuarioDto extends PartialType(CreateAutUsuarioDto) {}
