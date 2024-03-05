import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateAutPerfilRecursoDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ description: `Identificador del recurso` })
  idRecurso: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ description: `Identificador del sistema` })
  idPerfil: number;

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
export class UpdateAutPerfilRecursoDto extends PartialType(
  CreateAutPerfilRecursoDto,
) {}

export class AutPerfilRecursoMDto {
  @Type(() => Number)
  @Expose({ name: 'id_recurso' })
  idRecurso: number;

  @Type(() => Number)
  @Expose({ name: 'id_sistema' })
  idSistema: number;

  @Type(() => Number)
  @Expose({ name: 'id_recurso_superior' })
  idRecursoSuperior: number;

  @Type(() => Number)
  @Expose({ name: 'id_tipo_recurso' })
  idTipoRecurso: number;

  @Expose({ name: 'uri' })
  uri: string;

  @Expose({ name: 'nombre_sistema' })
  nombreSistema: string;

  @Expose({ name: 'nombre_recurso' })
  nombreRecurso: string;

  @Expose({ name: 'nombre_tipo_recurso' })
  nombreTipoRecurso: string;

  @Expose({ name: 'nombre_recurso_superior' })
  nombreRecursoSuperior: string;

  @Expose({ name: 'descripcion_recurso' })
  descripcionRecurso: string;

  @Expose({ name: 'es_visible' })
  esVisible: boolean;

  @Expose({ name: 'orden' })
  orden: number;

  @Expose({ name: 'icono' })
  icono: string;

  @Expose({ name: 'baja_logica_registro' })
  bajaLogicaRegistro: boolean;

  @Expose({ name: 'recurso_asignado' })
  recursoAsignado: boolean;
 
  fecha_registro: Date;
  usuario_registro: string;
  ip_registro: string;
  fecha_modificacion: Date;
  usuario_modificacion: string;
}
