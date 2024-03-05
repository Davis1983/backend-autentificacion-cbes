import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { Expose, Type } from 'class-transformer';
  import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

  export class AutUsuarioPerfilRecursoMDto {
    @Type(() => Number)
    @Expose({ name: 'id_recurso' })
    idRecurso: number;

    @Type(() => Number)
    @Expose({ name: 'id_recurso_superior' })
    idRecursoSuperior: number;

    @Type(() => Number)
    @Expose({ name: 'id_tipo_recurso' })
    idTipoRecurso: number;

    @Expose({ name: 'nombre_tipo_recurso' })
    nombreTipoRecurso: string;

    @Expose({ name: 'uri' })
    uri: string;

    @Expose({ name: 'nombre_recurso' })
    nombreRecurso: string;

    @Expose({ name: 'es_visible' })
    esVisible: boolean;

    @Expose({ name: 'orden' })
    orden: number;

    @Expose({ name: 'icono' })
    icono: string;

    @Expose({ name: 'nombre_recurso_superior' })
    nombreRecursoSuperior: string;

    @Expose({ name: 'baja_logica_registro' })
    bajaLogicaRegistro: boolean;
    esSuperior:string;
  }
