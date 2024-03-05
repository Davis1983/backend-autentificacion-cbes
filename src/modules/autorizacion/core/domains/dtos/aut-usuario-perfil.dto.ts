import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { Expose, Type } from 'class-transformer';
  import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
  
  export class CreateAutUsuarioPerfilDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    @ApiProperty({ description: `Identificador del sistema` })
    readonly idSistema: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: `Identificador del nivel del perfil` })
    readonly idcNivelRestriccion: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: `Almacena el nombre del perfil` })
    readonly nombrePerfil: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: `Almacena el nombre del perfil` })
    readonly descripcionPerfil: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'se asigna de manera automatica no agregar datos',
    })
    fechaRegistro: Date;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'se asigna de manera automatica no agregar datos',
    })
    usuarioRegistro: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'se asigna de manera automatica no agregar datos',
    })
    ipRegistro: string;

    @IsOptional()
    @ApiPropertyOptional({
        description: 'se asigna de manera automatica no agregar datos',
    })
    bajaLogicaRegistro: boolean;

    @IsOptional()
    @ApiPropertyOptional({
        description: 'se asigna de manera automatica no agregar datos',
    })
    fechaModificacion: Date;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'se asigna de manera automatica no agregar datos',
    })
    usuarioModificacion: string;
    }
  export class UpdateAutUsuarioPerfilDto extends PartialType(
    CreateAutUsuarioPerfilDto,
  ) {}
  
  export class AutUsuarioPerfilMDto {
    @Type(() => Number)
    @Expose({ name: 'id_perfil' })
    idPerfil: number;
  
    @Type(() => Number)
    @Expose({ name: 'id_sistema' })
    idSistema: number;
    
    @Expose({ name: 'nombre_perfil' })
    nombrePerfil: string;
  
    @Expose({ name: 'descripcion_perfil' })
    descripcionPerfil: string;
    
    @Expose({ name: 'perfil_asignado' })
    perfilAsignado: boolean;
    
    @Expose({ name: 'baja_logica_registro' })
    bajaLogicaRegistro: boolean;
     
    fecha_registro: Date;
    usuario_registro: string;
    ip_registro: string;
    fecha_modificacion: Date;
    usuario_modificacion: string;
  }
  