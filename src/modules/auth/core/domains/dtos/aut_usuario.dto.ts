import {
    IsString,
    IsNumber,
    IsUrl,
    IsNotEmpty,
    IsPositive,
    IsDate,
    IsEmpty,
    IsBoolean,
    IsEmail,
  } from 'class-validator';
  import { PartialType, ApiProperty } from '@nestjs/swagger';
  
  export class CreateAutUsuarioDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: `Nombre de usuario.` })
    readonly usuario: string;
  
    // @IsString()
    // @IsNotEmpty()
    // @ApiProperty({ description: `Clasificador del nivel de usuario` })
    // readonly idc_nivel: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: `Contraseña del usuario` })
    readonly contrasenia: string;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ description: `Identificador para determinar si la contraseña fue reseteada.`})
    readonly contraseniaReset: boolean;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: `Clasificador tipo de usuario.` })
    readonly idcTipoUsuario: string;

    // @IsNumber()
    // @IsNotEmpty()
    // @ApiProperty({ description: `Código de institución.` })
    // readonly idInstitucion: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: `Correo electrónico.` })
    readonly correoElectronico: string;
  
    @IsString()
    @IsEmpty()
    @ApiProperty({ description: `Teléfono fijo o celular.`})
    readonly telefono: Date;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: `Clasificador del estado usuario.` })
    readonly idcEstado: string;

    @IsDate()
    //@IsNotEmpty()
    @ApiProperty({ description: `Fecha de registro para eventos de CRUD.`})
    readonly fechaRegistro: Date;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: `Usuario de aplicacion y/o Base de datos involucrado en eventos de CRUD.`})
    readonly usuarioRegistro: string;
   
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: `Dirección IP involucrada en eventos de CRUD.`})
    readonly ipRegistro: string;
  
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ description: `Estado del Clasificador Baja/Activo.`})
    readonly bajaLogicaRegistro: boolean;
  
    @IsDate()
    //@IsEmpty()
    @ApiProperty({ description: `Registro de Fecha de Modificación por el usuario.`})
    readonly fechaModificacion: Date;
  
    @IsString()
    //@IsEmpty()
    @ApiProperty({ description: `Username del Usuario que realizó la modificación.`})
    readonly usuarioModificacion: string;
  }
  
  export class UpdateAutUsuarioDto extends PartialType(CreateAutUsuarioDto) {}