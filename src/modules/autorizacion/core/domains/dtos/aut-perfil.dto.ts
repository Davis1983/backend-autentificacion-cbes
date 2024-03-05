import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CreateAutPerfilDto {
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

  @ApiProperty({ description: `Lista de id recursos` })
  readonly colIdRecurso: number[];
}

export class UpdateAutPerfilDto extends PartialType(CreateAutPerfilDto) {}

export class CreateUpdateAutPerfilDto extends PartialType(CreateAutPerfilDto) {
}

export class AutPerfilMDto {
  @Type(() => Number)
  @Expose({ name: 'id_perfil' })
  idRecurso: number;

  @Type(() => Number)
  @Expose({ name: 'id_sistema' })
  idSistema: number;

  @Expose({ name: 'nombre_perfil' })
  nombreRecurso: string;

  @Expose({ name: 'descripcion_perfil' })
  descripcionPerfil: string;
  fecha_registro: Date;
  usuario_registro: string;
  ip_registro: string;
  baja_logica_registro: boolean;
  fecha_modificacion: Date;
  usuario_modificacion: string;
}
export class ContextoDto{
  @IsString()
  @ApiProperty({ description: `sistema` })
  @Expose({ name: 'sistema' })
  sistema: string;

  @IsString()
  @ApiProperty({ description: `usuario` })
  @Expose({ name: 'usuario' })
  usuario: string;

  @IsNumber()
  @ApiProperty({ description: `idUsuarioRestriccion` })
  @Expose({ name: 'idUsuarioRestriccion' })
  idUsuarioRestriccion: number;
}
