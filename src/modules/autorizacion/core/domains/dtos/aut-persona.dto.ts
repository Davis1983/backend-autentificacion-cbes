import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsDate, IsEmail, IsNumber, IsArray
} from "class-validator";
import { Expose, Type } from 'class-transformer';
import {ApiProperty, ApiPropertyOptional, PartialType} from '@nestjs/swagger';

export class CreateAutPersonaDto {
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
	@ApiProperty({description: 'Complemento para los carnets homónimos'})
	readonly complemento: string;

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		description: 'Switch para mostrar el complemento de un número de carnet',
	})
	readonly complementoVisible: boolean;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({description: 'Nombre completo de la persona.'})
	readonly nombres: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({description: 'Primer Apellido de la persona.'})
	readonly primerApellido: string;

	@IsString()
	@IsOptional()
	@ApiProperty({description: 'Segundo Apellido de la persona.'})
	readonly segundoApellido: string;

	@IsDate()
	@IsNotEmpty()
	@ApiProperty({description: 'Fecha de nacimiento de la persona.'})
	readonly fechaNacimiento: Date;

	@IsString()
	@IsOptional()
	@ApiProperty({
		description: 'Lugar de expedición del carnet de identidad de la persona.',
	})
	readonly expedicion: string;

	@IsDate()
	@IsOptional()
	@ApiPropertyOptional({description: 'Fecha de registro para eventos de CRUD.'})
	readonly fechaRegistro: Date;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		description: 'Usuario de aplicacion y/o Base de datos involucrado en eventos de CRUD.',
	})
	readonly usuarioRegistro: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({description: 'Dirección IP involucrada en eventos de CRUD.'})
	readonly ipRegistro: string;

	@IsBoolean()
  	@IsOptional()
	@ApiPropertyOptional({description: 'Eliminación Logica de la persona'})
	readonly bajaLogicaRegistro: boolean;

	@IsDate()
	@IsOptional()
	@ApiPropertyOptional({
		description: 'Registro de Fecha de Modificación por el usuario.',
	})
	readonly fechaModificacion: Date;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		description: 'Username del Usuario que realizó la modificación.',
	})
	readonly usuarioModificacion: string;

	@IsBoolean()
	@IsOptional()
	@ApiPropertyOptional({
		description: 'Bandera para verificacion de Segip.',
	})
	readonly verificacionSegip: boolean;

	/**
	 * De la entidad aut-usuario
	*/
	@IsString()
	@IsOptional()
	@ApiProperty({ description: `Usuario.` })
	usuario: string;

	@IsEmail()
	@IsOptional()
	@ApiProperty({ description: `Correo electrónico.` })
	correoElectronico: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ description: `IDC tipo usuario ejemplo TIPO_USUARIO_EXTERNO` })
	idcTipoUsuario: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ description: `IDC tipo usuario ejemplo ESTADO_USUARIO_HABILITADO` })
	idcEstado: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ description: `Numero de Telefono` })
	telefono: string;

	/**
	 * De la entidad aut-profesion-persona
	*/

	@IsNumber()
	@IsOptional()
	@ApiProperty({ description: `Id grupo profesion` })
	idGrupoProfesion: number;

	@IsString()
	@IsOptional()
	@ApiProperty({ description: `Matricula Profesional` })
	matriculaProfesional: string;

	/**
	 * De la entidad aut-usuario-restriccion
	*/

	@IsNumber()
	@IsOptional()
	@ApiProperty({ description: `Id Sistema` })
	idSistema: number;

	@IsNumber()
	@IsOptional()
	@ApiProperty({ description: `Id Institucion` })
	idInstitucion: number;

	@IsString()
	@IsOptional()
	@ApiProperty({ description: `Id Subsector` })
	idcSubSector: string;

	@IsNumber()
	@IsOptional()
	@ApiProperty({ description: `Id Subsector RUES` })
	idSubsector: number;

	@IsString()
	@IsOptional()
	@ApiProperty({ description: `IDC nivel ejemplo ESTABLECIMIENTO` })
	idcNivel: string;

	@IsNumber()
	@IsOptional()
	@ApiProperty({ description: `Id Nivel usuario` })
	idNivel: number;

	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	@ApiProperty({ description: `codigo departamento` })
	codDepartamento: number;

	@IsString()
	@IsOptional()
	@ApiProperty({ description: `departamento` })
	departamento: string;


	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	@ApiProperty({ description: `codigo area` })
	codArea: number;

	@IsString()
	@IsOptional()
	@ApiProperty({ description: `area` })
	area: string;

	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	@ApiProperty({ description: `cod municipio` })
	codMunicipio: number;

	@IsString()
	@IsOptional()
	@ApiProperty({ description: `municipio` })
	municipio: string;

	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	@ApiProperty({ description: `cod establecimiento` })
	codEstablecimiento: number;

	@IsString()
	@IsOptional()
	@ApiProperty({ description: `Establecimineto de Salud` })
	establecimiento: string;


	// /**
	//  * De la entidad aut-usuario-restriccion-perfil
	// */
	@IsArray()
	@Type(() => Number)
	@ApiProperty({ description: `Lista de id perfiles` })
	colIdPerfiles: number[];
}

export class UpdateAutPersonaDto extends PartialType(CreateAutPersonaDto) {}
export class CreateUpdateAutPersonaDto extends PartialType(CreateAutPersonaDto) {
}
