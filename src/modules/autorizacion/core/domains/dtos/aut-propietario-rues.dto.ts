
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsDate,
  } from 'class-validator';
  import { Expose, Type } from 'class-transformer';
  import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
  
  export class CreateAutPropietarioRuesDto {
        
    /****Tabla persona****/
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({description: 'Tabla persona, no es obligatorio - Número de carnet de identidad codificado.'})
    hash: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({description: 'Tabla persona, obligatorio - Número de carnet de identidad.'})
    readonly numeroDocumento: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({description: 'Complemento para los carnets homónimos'})
    readonly complemento: string;

    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional({
      description: 'Switch para mostrar el complemento de un número de carnet',
    })
    complementoVisible: boolean;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({description: 'Nombre completo de la persona.'})
	  readonly nombres: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({description: 'Primer Apellido de la persona.'})
    readonly primerApellido: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({description: 'Segundo Apellido de la persona.'})
    readonly segundoApellido: string;

    @IsDate()
    @IsOptional()
    @ApiPropertyOptional({description: 'Fecha de nacimiento de la persona.'})
    readonly fechaNacimiento: Date;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
      description: 'Lugar de expedición del carnet de identidad de la persona.',
    })
    readonly expedicion: string;

    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional({
      description: 'Bandera para verificacion de Segip.',
    })
    verificacionSegip: boolean;
    /*****TABLA aut_profesion_persona****/
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: `Id grupo profesion` })
    idGrupoProfesion: number;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: `Matricula Profesional` })
    matriculaProfesional: string;
    /**********************/

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: `Código único del establecimiento de salud y llave foranea a la tabla de establecimientos de salud..` })
    readonly codigoEstablecimiento: number;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: `Clasificador para los responsables del E.S. [Propietario, Representante, Máxima Autoridad del Establecimiento de Salud]` })
    readonly idcTipoResponsable: string;
  
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: `Dirección completa de residencia de la persona natural.` })
    readonly direccion: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: `Dirección de correo electrónico.` })
    readonly correoElectronico: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: `Número de telefono fijo de la persona.` })
    readonly telefonoFijo: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: `Número de telefono celular de la persona.` })
    readonly telefonoCelular: string;
     
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
  export class UpdateAutPropietarioRuesDto extends PartialType(CreateAutPropietarioRuesDto) {}
  