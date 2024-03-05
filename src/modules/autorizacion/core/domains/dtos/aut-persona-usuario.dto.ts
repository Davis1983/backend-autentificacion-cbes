import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsEmail,
    IsDate,
	IsArray
  } from 'class-validator';
  import { Expose, Type } from 'class-transformer';
  import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
  
  export class CreateAutPersonaUsuarioDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    @ApiProperty({ description: `Identificador de la persona` })
    idPersona: number;
  
    @IsString()
	@IsOptional()
	@ApiPropertyOptional({description: 'Tabla persona, no es obligatorio - Número de carnet de identidad codificado.'})
	hash: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({description: 'Tabla persona, obligatorio - Número de carnet de identidad.'})
	numeroDocumento: string;

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
	idcSubsector: string;

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
	@IsNotEmpty()
	@ApiProperty({ description: `departamento` })
	departamento: string;


	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	@ApiProperty({ description: `codigo area` })
	codArea: number;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: `area` })
	area: string;

	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	@ApiProperty({ description: `cod municipio` })
	codMunicipio: number;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: `municipio` })
	municipio: string;

	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	@ApiProperty({ description: `cod establecimiento` })
	codEstablecimiento: number;

	@IsString()
	@IsNotEmpty()
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
  export class UpdateAutPersonaUsuarioDto extends PartialType(
    CreateAutPersonaUsuarioDto,
  ) {}
  
  export class AutPersonaUsuarioMDto {
    @Type(() => Number)
    @Expose({ name: 'id_persona' })
    idPersona: number;

    @Expose({ name: 'nombres' })
    nombres: string;

    @Expose({ name: 'primer_apellido' })
    primerApellido: string;

    @Expose({ name: 'segundo_apellido' })
    segundoApellido: string;

    @Expose({ name: 'fecha_nacimiento' })
    fechaNacimiento: string;

    @Expose({ name: 'numero_documento' })
    numeroDocumento: string;

    @Expose({ name: 'expedicion' })
    expedicion: string;

    @Expose({ name: 'complemento' })
    complemento: string;

    @Expose({ name: 'complemento_visible' })
    complementoVisible: boolean;

    @Expose({ name: 'usuario' })
    usuario: string;

    @Expose({ name: 'correo_electronico' })
    correoElectronico: string;

    @Expose({ name: 'telefono' })
    telefono: string;

    @Expose({ name: 'idc_estado' })
    idcEstado: string;
  
    @Type(() => Number)
    @Expose({ name: 'id_grupo_profesion' })
    idGrupoProfesion: number;
   
    @Expose({ name: 'matricula_profesional' })
    matriculaProfesional: string;
  
    @Expose({ name: 'nombre_grupo_profesion' })
    nombreGrupoProfesion: string;
  
    @Type(() => Number)
    @Expose({ name: 'id_sistema' })
    idSistema: number;

	@Type(() => Number)
    @Expose({ name: 'id_institucion' })
    idInstitucion: number;

	@Expose({ name: 'idc_subsector' })
    idcSubSector: string;
	
	@Expose({ name: 'id_subsector' })
    idSubsector: string; 

	@Expose({ name: 'idc_nivel' })
    idcNivel: string;

	@Type(() => Number)
    @Expose({ name: 'id_nivel' })
    idNivel: number;

	@Type(() => Number)
    @Expose({ name: 'cod_departamento' })
    codDepartamento: number;

	@Expose({ name: 'departamento' })
    departamento: string; 

	@Type(() => Number)
    @Expose({ name: 'cod_departamento' })
    codArea: number;

	@Expose({ name: 'departamento' })
    area: string;

	@Type(() => Number)
    @Expose({ name: 'cod_municipio' })
    codMunicipio: number;

	@Expose({ name: 'municipio' })
    municipio: string;

	@Type(() => Number)
    @Expose({ name: 'cod_establecimiento' })
    codEstablecimiento: number;

	@Expose({ name: 'establecimiento' })
    establecimiento: string;
  
    fecha_registro: Date;
    usuario_registro: string;
    ip_registro: string;
    baja_logica_registro: boolean;
    fecha_modificacion: Date;
    usuario_modificacion: string;
  }
  