import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateAutRecursoDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ description: `Identificador del sistema` })
  readonly idSistema: number;

  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: `Se asigna el ID padre de la tabla AutRecurso`,
  })
  idRecursoSuperior: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ description: `Se asigna el de la tabla par tipo recurso` })
  readonly idTipoRecurso: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `URL de acceso a la aplicacion` })
  readonly uri: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Almacena el nombre del recurso` })
  readonly nombreRecurso: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Almacena la descripcion del recurso` })
  readonly descripcionRecurso: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: `Almacena la descripcion del recurso` })
  readonly esVisible: boolean;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ description: `Orden del menu de acuerdo a la prioridad` })
  readonly orden: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Icono del Recurso` })
  readonly icono: string;

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
export class UpdateAutRecursoDto extends PartialType(CreateAutRecursoDto) {}

export class AutRecursoMDto {
  @Type(() => Number)
  @Expose({ name: 'id_recurso' })
  idRecurso: number;

  @Type(() => Number)
  @Expose({ name: 'id_sistema' })
  idSistema: number;

  @Expose({ name: 'identificador_sistema' })
  identificadorSistema: string;

  @Type(() => Number)
  @Expose({ name: 'id_recurso_superior' })
  idRecursoSuperior: number;

  @Type(() => Number)
  @Expose({ name: 'id_tipo_recurso' })
  idTipoRecurso: number;

  @Expose({ name: 'uri' })
  uri: string;

  @Expose({ name: 'nombre_recurso' })
  nombreRecurso: string;

  @Expose({ name: 'descripcion_recurso' })
  descripcionRecurso: string;
  @Expose({ name: 'es_visible' })
  esVisible: boolean;
  @Expose({ name: 'orden' })
  orden: number;
  @Expose({ name: 'icono' })
  icono: string;
  @Expose({ name: 'fecha_registro' })
  fechaRegistro: Date;
  @Expose({ name: 'usuario_registro' })
  usuarioRegistro: string;
  @Expose({ name: 'ipRegistro' })
  ipRegistro: string;
  @Expose({ name: 'baja_logica_registro' })
  bajaLogicaRegistro: boolean;
  @Expose({ name: 'fecha_modificacion' })
  fechaModificacion: Date;
  @Expose({ name: 'usuario_modificacion' })
  usuarioModificacion: string;
  nombreRecursoPadre: string;
  nombreTipoRecurso: string;
}
