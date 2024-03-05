import {InjectRepository} from '@nestjs/typeorm';
import {AutPersonaServiceInterface} from '../aut-persona.interface';
import {AutPersona} from '../../core/domains/entities/aut-persona.entity';
import {LessThan, Raw, Repository} from 'typeorm';
import { Client } from 'pg';
import { type CreateAutPersonaDto, UpdateAutPersonaDto } from "../../core/domains/dtos/aut-persona.dto";
import { type CreateAutPersonaRuesDto, UpdateAutPersonaRuesDto } from '../../core/domains/dtos/aut-persona-rues.dto';
import { type CreateAutPropietarioRuesDto, UpdateAutPropietarioRuesDto } from '../../core/domains/dtos/aut-propietario-rues.dto';
import {type RespuestaM} from 'src/core/domain/models/respuesta.model';
import {RespuestaService} from 'src/modules/shared/services/respuesta.service';
import {PaginationDto} from '../../../../core/domain/dtos/pagination.dto';
import {Inject, Injectable, Logger} from '@nestjs/common';
import * as moment from 'moment';
import { formatoFecha, generaNombreUsuario } from "../../../../common/utility/all.utill";
import {RespuestaConsultaEnum} from '../../../../core/enum/respuesta-consulta.enum';
import {AutUsuarioService} from './aut-usuario.service';
import { AuthService } from "../../../auth/services/auth.service";
import { CreateAutUsuarioDto } from "../../core/domains/dtos";
import { AutProfesionPersonaService } from './aut-profesion-persona.service';
import { AutUsuarioRestriccionService } from './aut-usuario-restriccion.service';
import { AutUsuarioRestriccionPerfilService } from './aut-usuario-restriccion-perfil.service';
import { CreateAutProfesionPersonaDto } from '../../core/domains/dtos/aut-profesion-persona.dto';
import { CreateAutUsuarioRestriccionDto } from '../../core/domains/dtos/aut-usuario-restriccion.dto';
import { AutPersonaUsuarioRespository } from '../../repositories/impl/aut-persona-usuario.repository';
import { AutPersonaUsuarioMapper_EntitiesToDtos } from '../../mapper/aut-persona-usuario.mapper';
import { OmitType } from '@nestjs/swagger';
import { AutProfesionPersona } from '../../core/domains/entities';

@Injectable()
export class AutPersonaService {
	_main = 'AutPersonaService';
	_autPersonaUsuarioRepository: AutPersonaUsuarioRespository;
	private readonly logger = new Logger('AutPersonaService');
	constructor(
		@Inject('PG') private _client: Client,
		@InjectRepository(AutProfesionPersona)
		private readonly _autProfesionPersonaEntity: Repository<AutProfesionPersona>,
		@InjectRepository(AutPersona)
		private readonly _autPersona: Repository<AutPersona>,
		private readonly _respuestaService: RespuestaService,
		private readonly _autUsuarioService: AutUsuarioService,
		private readonly _auth:AuthService,
		private readonly _autProfesionPersona:AutProfesionPersonaService,
		private readonly _autUsuarioRestriccion:AutUsuarioRestriccionService,
		private readonly _autUsuarioRestriccionPerfil:AutUsuarioRestriccionPerfilService,
	){
		this._autPersonaUsuarioRepository = new AutPersonaUsuarioRespository(_client);
	  }

	/**
   *Lista una persona de acuerdo a su Id de Usuario
   * @param id
   */
	async findOne(id: number): Promise<RespuestaM> {
		const ruta = this._main + '/ findOne';
		let persona = null;
		try {
			persona = await this._autPersona.findOne({
				select: {
					idPersona: true,
					nombres: true,
					primerApellido: true,
					segundoApellido: true,
					fechaNacimiento: true,
				},
				where: {
					idPersona: id,
					bajaLogicaRegistro: false,
				},
			});
			if (persona) {
				persona.fechaNacimiento = formatoFecha(persona.fechaNacimiento);
				return this._respuestaService.respuestaHttp(
					true,
					persona,
					ruta,
					RespuestaConsultaEnum.LISTADO_EXITOSO,
				);
			}

			return this._respuestaService.respuestaHttp(
				false,
				null,
				ruta,
				RespuestaConsultaEnum.SIN_REGISTRO,
			);
		} catch (e) {
			this.logger.error(e);
			return this._respuestaService.respuestaHttp(
				false,
				null,
				ruta,
				`Error ${e.code}`,
			);
		}
	}
	async createAutPersona(data: CreateAutPersonaDto): Promise<RespuestaM> {
		const ruta = this._main + '/ createAutPersona';
		try{
			let resp = null;
			let userRegistro = null;
			if(data.numeroDocumento && data.complemento){
				resp = await this._autPersona.find({
					select:{
						idPersona:true,
					},
					where:{
						numeroDocumento:data.numeroDocumento,
						complemento:data.complemento,
					}
				});
			}else if(data.numeroDocumento){
				resp = await this._autPersona.find({
					select:{
						idPersona:true,
					},
					where:{
						numeroDocumento:data.numeroDocumento,
					}
				});
			}
			if(resp && resp.length > 0){
				userRegistro = await this._autUsuarioService.findOne (resp[0].idPersona);
				if(userRegistro.status == true){
					return this._respuestaService.respuestaHttp(
						false,
						null,
						ruta,
						'La Persona ya cuenta con usuario registrado',
					);
				}
			}
			const validarCorreo = await this._autUsuarioService.findUsuarioByCorreo(data.correoElectronico);
			if(validarCorreo.data){
				return this._respuestaService.respuestaHttp(
					false,
					null,
					ruta,
					'El correo electronico ya se encuentra registrado',
				);
			}
			let bandera = false;
			let intento = 1;
			let usuarioAdd = null;
			let buscadorUsuario = null;
			while (!bandera){
				if(data.primerApellido != '--'){
					usuarioAdd = generaNombreUsuario(data.nombres, data.primerApellido,intento);
				}else{
					usuarioAdd = generaNombreUsuario(data.nombres, data.segundoApellido,intento);
				}
				buscadorUsuario= await this._autUsuarioService.findUsuario(usuarioAdd);
				if(!buscadorUsuario.data){
					bandera=true;
				}else{
					intento+=1;
				}
			};
			//return this._respuestaService.respuestaHttp(true,usuarioAdd+':'+bandera,null,null);
			const usuario = new CreateAutUsuarioDto();
			const profesion = new CreateAutProfesionPersonaDto();
			const usuarioRestriccion = new CreateAutUsuarioRestriccionDto();
			data.hash = this._auth.getPassword(data.numeroDocumento);
			let idPersona = null;
			if(resp && resp.length > 0){
				idPersona = resp[0].idPersona;
			}else{
				const newPersona = this._autPersona.create(data);
				let persona = null;
				persona = await this._autPersona.insert(newPersona);
				if(!persona){
					return this._respuestaService.respuestaHttp(
						false,
						null,
						ruta,
						RespuestaConsultaEnum.ERROR_EN_EL_REGISTRO,
					);
				}
				const {raw} = persona;
				//return this._respuestaService.respuestaHttp(true, raw[0].id_persona, ruta,'registro exitoso');
				/**Registro en la tabla aut_usuario**/
				idPersona = +raw[0].id_persona;
			}
			
			usuario.idPersona = idPersona;
			usuario.usuario = usuarioAdd;
			usuario.contrasenia = data.hash;
			usuario.idcTipoUsuario = data.idcTipoUsuario;
			usuario.correoElectronico = data.correoElectronico;
			usuario.telefono = data.telefono;
			usuario.idcEstado = 'ESTADO_USUARIO_HABILITADO';
			const saveUsuario = await this._autUsuarioService.createAutUsuario(usuario);
			/**Registro en la tabla aut_profesion_persona**/
			profesion.idPersona = idPersona;
			profesion.idGrupoProfesion = data.idGrupoProfesion;
			profesion.matriculaProfesional = data.matriculaProfesional;
			const resultado = await this._autProfesionPersona.createAutProfesionPersona(profesion);
			/**Registro en la tabla aut_usuario_restriccion**/
			usuarioRestriccion.usuario = usuarioAdd;
			usuarioRestriccion.idSistema = data.idSistema;
			usuarioRestriccion.idInstitucion = data.idInstitucion;
			usuarioRestriccion.idSubsector = data.idSubsector;
			usuarioRestriccion.idcNivel = data.idcNivel;
			usuarioRestriccion.idNivel = data.idNivel;
			usuarioRestriccion.codDepartamento = data.codDepartamento;
			// usuarioRestriccion.departamento = data.departamento;
			usuarioRestriccion.codArea = data.codArea;
			// usuarioRestriccion.area = data.area;
			usuarioRestriccion.codMunicipio = data.codMunicipio;
			// usuarioRestriccion.municipio = data.municipio;
			usuarioRestriccion.codEstablecimiento = data.codEstablecimiento;
			// usuarioRestriccion.establecimiento = data.establecimiento;
			const saveUsuarioRestriccion = await this._autUsuarioRestriccion.createAutUsuarioRestriccion(usuarioRestriccion);
			/**Obtenemos el id de la tabla aut_usuario_restriccion*/
			const saveUsuarioRestriccionPerfil = await this._autUsuarioRestriccionPerfil.createListAutUsuarioRestriccionPerfil(saveUsuarioRestriccion.data.idUsuarioRestriccion, data.colIdPerfiles);
			//Enviamos el mail de Confirmación de creación de usuario
			const envioMail = await this._auth.mailCreateUser(usuarioAdd, data.idcNivel, data.numeroDocumento);
			return this._respuestaService.respuestaHttp(true,saveUsuario,null,'Registro Exitoso');
			/****/
		}catch (e){
			return this._respuestaService.respuestaHttp(
				false,
				null,
				ruta,
				RespuestaConsultaEnum.ERROR_EN_EL_REGISTRO + e,
			);
		}
	}

	async createOnePersona(data: CreateAutPersonaDto): Promise<RespuestaM> {
		const ruta = this._main + '/ createAutPersona';
		try{
			let resp = null;
			if(data.numeroDocumento && data.complemento){
				resp = await this._autPersona.find({
					select:{
						idPersona:true,
					},
					where:{
						numeroDocumento:data.numeroDocumento,
						complemento:data.complemento,
					}
				});
			}else if(data.numeroDocumento){
				resp = await this._autPersona.find({
					select:{
						idPersona:true,
					},
					where:{
						numeroDocumento:data.numeroDocumento,
					}
				});
			}
			if(resp && resp.length > 0){
				return this._respuestaService.respuestaHttp(
					false,
					null,
					ruta,
					'La Persona ya se encuentra registrada',
				);
			}
			const validarCorreo = await this._autUsuarioService.findUsuarioByCorreo(data.correoElectronico);
			if(validarCorreo.data){
				return this._respuestaService.respuestaHttp(
					false,
					null,
					ruta,
					'El correo electronico ya se encuentra registrado',
				);
			}
			let bandera = false;
			let intento = 1;
			let usuarioAdd = null;
			let buscadorUsuario = null;
			while (!bandera){
				if(data.primerApellido){
					usuarioAdd = generaNombreUsuario(data.nombres,data.primerApellido,intento);
				}else{
					usuarioAdd = generaNombreUsuario(data.nombres,data.segundoApellido,intento);
				}
				buscadorUsuario= await this._autUsuarioService.findUsuario(usuarioAdd);
				if(!buscadorUsuario.data){
					bandera=true;
				}else{
					intento+=1;
				}
			};
			return this._respuestaService.respuestaHttp(true,usuarioAdd+':'+bandera,null,null);
			const usuario = new CreateAutUsuarioDto();
			const profesion = new CreateAutProfesionPersonaDto();
			const usuarioRestriccion = new CreateAutUsuarioRestriccionDto();
			data.hash = this._auth.getPassword(data.numeroDocumento);
			const newPersona = this._autPersona.create(data);
			let persona = null;
			persona = await this._autPersona.insert(newPersona);
			if(!persona){
				return this._respuestaService.respuestaHttp(
					false,
					null,
					ruta,
					RespuestaConsultaEnum.ERROR_EN_EL_REGISTRO,
				);
			}
			const {raw} = persona;
			//return this._respuestaService.respuestaHttp(true, raw[0].id_persona, ruta,'registro exitoso');
			/**Registro en la tabla aut_usuario**/
			const idPersona = +raw[0].id_persona;
			usuario.idPersona = idPersona;
			usuario.usuario = usuarioAdd;
			usuario.contrasenia = data.hash;
			usuario.idcTipoUsuario = data.idcTipoUsuario;
			usuario.correoElectronico = data.correoElectronico;
			usuario.telefono = data.telefono;
			usuario.idcEstado = 'ESTADO_USUARIO_HABILITADO';
			const saveUsuario = await this._autUsuarioService.createAutUsuario(usuario);
			/**Registro en la tabla aut_profesion_persona**/
			profesion.idPersona = idPersona;
			profesion.idGrupoProfesion = data.idGrupoProfesion;
			profesion.matriculaProfesional = data.matriculaProfesional;
			const resultado = await this._autProfesionPersona.createAutProfesionPersona(profesion);
			/**Registro en la tabla aut_usuario_restriccion**/
			usuarioRestriccion.usuario = usuarioAdd;
			usuarioRestriccion.idSistema = data.idSistema;
			usuarioRestriccion.idInstitucion = data.idInstitucion;
			usuarioRestriccion.idcSubSector = data.idcSubSector;
			usuarioRestriccion.idcNivel = data.idcNivel;
			usuarioRestriccion.idNivel = data.idNivel;
			usuarioRestriccion.codDepartamento = data.codDepartamento;
			// usuarioRestriccion.departamento = data.departamento;
			usuarioRestriccion.codArea = data.codArea;
			// usuarioRestriccion.area = data.area;
			usuarioRestriccion.codMunicipio = data.codMunicipio;
			// usuarioRestriccion.municipio = data.municipio;
			usuarioRestriccion.codEstablecimiento = data.codEstablecimiento;
			// usuarioRestriccion.establecimiento = data.establecimiento;
			const saveUsuarioRestriccion = await this._autUsuarioRestriccion.createAutUsuarioRestriccion(usuarioRestriccion);
			/**Obtenemos el id de la tabla aut_usuario_restriccion*/
			const saveUsuarioRestriccionPerfil = await this._autUsuarioRestriccionPerfil.createListAutUsuarioRestriccionPerfil(saveUsuarioRestriccion.data.idUsuarioRestriccion, data.colIdPerfiles);

			return this._respuestaService.respuestaHttp(true,saveUsuario,null,'Registro Exitoso');
			/****/
		}catch (e){
			return this._respuestaService.respuestaHttp(
				false,
				null,
				ruta,
				RespuestaConsultaEnum.ERROR_EN_EL_REGISTRO + e,
			);
		}
	}
	async updateAutPersona(id: number, updateAutPersona: UpdateAutPersonaDto) {
		const ruta = this._main + '/ updateAutPersona';
		try {
			const persona = await this._autPersona.findOneBy({
				idPersona: id
			  });
			if (!persona)
			  return this._respuestaService.respuestaHttp(
				false,
				null,
				ruta,
				'Registro no Encontrado',
			  );
			  persona.usuarioModificacion = 'postgres';
			  this._autPersona.merge(persona, updateAutPersona);
			  const updateConsolidado = await this._autPersona.save(persona);
			  /*Actualizamos los datos del usuario*/
			  const updateUsuario = await this._autUsuarioService.updateAutUsuario(id,updateAutPersona);
			  const updateProfesionPersona = await this._autProfesionPersona.updateAutProfesionPersona(id,updateAutPersona);
			  if (!updateConsolidado)
				return this._respuestaService.respuestaHttp(
				  false,
				  null,
				  ruta,
				  'Error en la actualización',
				);
				const updateUsuarioRestriccion = await this._autUsuarioRestriccion.updateAutUsuarioRestriccion2(updateUsuario.usuario,updateAutPersona);
			console.log({updateUsuarioRestriccion});
				if(!updateUsuarioRestriccion){
					return this._respuestaService.respuestaHttp(
						false,
						null,
						ruta,
						'Error en la actualización de usuario Restriccion',
					);
				}
				console.log(updateUsuarioRestriccion.data.idAutUsuarioRestriccion);
				const updateUsuarioPerfilRestriccion = await this._autUsuarioRestriccionPerfil.createListAutUsuarioRestriccionPerfil(updateUsuarioRestriccion.data, updateAutPersona.colIdPerfiles);
			  	const resp = {
				idPersona: updateConsolidado.idPersona,
				nombre: updateConsolidado.nombres+' '+updateConsolidado.primerApellido+' '+updateConsolidado.segundoApellido,
				usuario: updateUsuario.usuario,
				correoElectronico: updateUsuario.correoElectronico,
				telefono: updateUsuario.telefono,
				matriculaProfesional: updateProfesionPersona.matriculaProfesional,
			  };
			  return this._respuestaService.respuestaHttp(
				true,
				resp,
				ruta,
				'Modificacion Correcta',
			  );
		  } catch (error) {
			return this._respuestaService.respuestaHttp(
			  false,
			  null,
			  ruta,
			  `Error ${error.message}`,
			);
		  }
		/*
		const usuario = await this._autUsuario.findOneBy({
			idPersona: id
		  });
		usuario.correoElectronico = changes.correoElectronico;
		usuario.telefono = changes.telefono;
		this._autUsuario.merge(usuario, changes);
		return this._autUsuario.save(usuario);*/
	}
	async findPersonaUsuarioByIdPersona(idPersona: number) {
	const ruta = this._main + '/ AutPersonaUsuario';
	try{
		const persona = await this._autPersona.findOneBy({
			idPersona: idPersona
			});
		if (!persona){
			return this._respuestaService.respuestaHttp(
			false,
			null,
			null,
			'No existe el idPersona',
			);
		}
		//const resultado = [];
		const resultado = await this._autPersonaUsuarioRepository.listaPersonaUsuario(idPersona);
		const ruta = this._main + ' / listaPersonaUsuario';
		const data = AutPersonaUsuarioMapper_EntitiesToDtos(resultado);
		return this._respuestaService.respuestaHttp(
		true,
		data,
		ruta,
		RespuestaConsultaEnum.LISTADO_EXITOSO,
		);
	} catch (e) {
		return null;
	}
	}
	async findByPersonaByIdAllRelation(idPersona:number){
		const ruta = this._main + '/ findByPersonaByIdAllRelation';
		try{
			let persona = null;
			persona = await this._autPersona.findOneBy({
				idPersona: idPersona
			});
			if (!persona){
				return this._respuestaService.respuestaHttp(
					false,
					null,
					null,
					'No existe el idPersona',
				);
			}

			const personaUsuarioProfesion = await this._autPersonaUsuarioRepository.findByPersonaByIdProfesionUsuario(idPersona);
			//console.log({personaUsuarioProfesion});
			//const usuarioRestriccion  = await this._autPersonaUsuarioRepository.usuarioRestriccion(personaUsuarioProfesion.usuario, personaUsuarioProfesion.idcNivel);
			const usuarioRestriccion  = await this._autPersonaUsuarioRepository.usuarioRestriccion(personaUsuarioProfesion.usuario);
			if(!usuarioRestriccion){
				const usuarioRestriccion ={usuarioRestriccion:[]};
				const usuarioRestPerfil={usuarioRestriccionPerfil:[]};
				const respuesta = {...personaUsuarioProfesion,...usuarioRestriccion,...usuarioRestPerfil}
				return this._respuestaService.respuestaHttp(true,respuesta,ruta,'Listado Correcto');
			}
			const array = {colIdPerfiles:await this._autPersonaUsuarioRepository.usuarioRestriccionPerfil(usuarioRestriccion.idUsuarioRestriccion)};
			const fusion = {...personaUsuarioProfesion,...usuarioRestriccion,...array};
			return this._respuestaService.respuestaHttp(true,fusion,ruta,'Listado Correcto');
		}
		catch (e){
		return null;
		}
	}
	  /****FUNCION PARA EL REGISTRO Y VALIDACION DE PERSONAS DESDE EL REGISTRO RUES*/
	async createAutPersonaRues(data: CreateAutPersonaRuesDto): Promise<RespuestaM> {
		const ruta = this._main + '/ createAutPersona';
		try{
			let resp = null;
			let respAutProfesion = null;
			if(data.numeroDocumento && data.complemento){
				data.hash = this._auth.getPassword(data.numeroDocumento+data.complemento);
				resp = await this._autPersona.find({
					select:{
						idPersona:true,
					},
					where:{
						numeroDocumento:data.numeroDocumento,
						complemento:data.complemento,
					}
				});
			}else if(data.numeroDocumento){
				data.hash = this._auth.getPassword(data.numeroDocumento);
				resp = await this._autPersona.find({
					select:{
						idPersona:true,
					},
					where:{
						numeroDocumento:data.numeroDocumento,
					}
				});
			}
			if(resp && resp.length > 0){
				//Validamos si ya cuenta con profesión registrada
				respAutProfesion = await this._autProfesionPersonaEntity.find({
					select:{
						idPersona:true,
					},
					where:{
						idPersona:resp[0].idPersona,
					}
				});
				/*if(respAutProfesion.length == 0){*/
					/**Registro en la tabla aut_profesion_persona**/
					// const profesion = new CreateAutProfesionPersonaDto();
					// profesion.idPersona = resp[0].idPersona;
					// profesion.idGrupoProfesion = data.idGrupoProfesion;
					// profesion.matriculaProfesional = data.matriculaProfesional;
					// const resultado = await this._autProfesionPersona.createAutProfesionPersona(profesion);
				//}
				return this._respuestaService.respuestaHttp(
					true,
					resp[0].idPersona,
					ruta,
					'La Persona ya se encuentra registrada: idPersona='+resp[0].idPersona,
				);
			}else{
				const newPersona = this._autPersona.create(data);
				let persona = null;
				persona = await this._autPersona.insert(newPersona);
				if(!persona){
					return this._respuestaService.respuestaHttp(
						false,
						null,
						ruta,
						RespuestaConsultaEnum.ERROR_EN_EL_REGISTRO,
					);
				}
				const {raw} = persona;
				const idPersona = +raw[0].id_persona;
				/**Registro en la tabla aut_profesion_persona**/
				/*const profesion = new CreateAutProfesionPersonaDto();
				profesion.idPersona = idPersona;
				profesion.idGrupoProfesion = data.idGrupoProfesion;
				profesion.matriculaProfesional = data.matriculaProfesional;
				const resultado = await this._autProfesionPersona.createAutProfesionPersona(profesion);*/
				return this._respuestaService.respuestaHttp(
					true,
					idPersona,
					ruta,
					'La Persona fue registrada exitosamente: idPersona='+idPersona,
				);
				/****/
			}
		}catch (e){
			return this._respuestaService.respuestaHttp(
				false,
				null,
				ruta,
				RespuestaConsultaEnum.ERROR_EN_EL_REGISTRO + e,
			);
		}
	}
	/**SERVICIO PARA EDITAR LOS DATOS DE LA PERSONA Y PROFESION DESDE EL RUES*/
	async updateAutPersonaRues(id: number, updateAutPersonaRues: UpdateAutPersonaRuesDto) {
		const ruta = this._main + '/ updateAutPersonaRues';
		try {
			const persona = await this._autPersona.findOneBy({
				idPersona: id
			  });
			if (!persona)
			  return this._respuestaService.respuestaHttp(
				false,
				null,
				ruta,
				'Registro no Encontrado',
			  );
			  persona.usuarioModificacion = 'postgres';
			  this._autPersona.merge(persona, updateAutPersonaRues);
			  const updateConsolidado = await this._autPersona.save(persona);
			  /*Actualizamos los datos de la profesion*/
			  //const updateProfesionPersona = await this._autProfesionPersona.updateAutProfesionPersona(id,updateAutPersonaRues);
			  const resp = {
				idPersona: updateConsolidado.idPersona,
			  };
			  return this._respuestaService.respuestaHttp(
				true,
				resp,
				ruta,
				'Modificacion Correcta',
			  );
		  } catch (error) {
			return this._respuestaService.respuestaHttp(
			  false,
			  null,
			  ruta,
			  `Error ${error.message}`,
			);
		  }
	  }
	 /****FUNCION PARA EL REGISTRO Y VALIDACION DE PERSONAS DESDE EL REGISTRO RUES*/
	 async createAutPropietarioRues(data: CreateAutPropietarioRuesDto): Promise<RespuestaM> {
		const ruta = this._main + '/ createAutPropietarioRues';
		try{
			let resp = null;
			let respAutProfesion = null;
			if(data.numeroDocumento && data.complemento){
				data.hash = this._auth.getPassword(data.numeroDocumento+data.complemento);
				resp = await this._autPersona.find({
					select:{
						idPersona:true,
					},
					where:{
						numeroDocumento:data.numeroDocumento,
						complemento:data.complemento,
					}
				});
			}else if(data.numeroDocumento){
				data.hash = this._auth.getPassword(data.numeroDocumento);
				resp = await this._autPersona.find({
					select:{
						idPersona:true,
					},
					where:{
						numeroDocumento:data.numeroDocumento,
					}
				});
			}
			if(resp && resp.length > 0){
				//Validamos si ya cuenta con profesión registrada
				respAutProfesion = await this._autProfesionPersonaEntity.find({
					select:{
						idPersona:true,
					},
					where:{
						idPersona:resp[0].idPersona,
					}
				});
				if(respAutProfesion.length == 0){
					/**Registro en la tabla aut_profesion_persona**/
					const profesion = new CreateAutProfesionPersonaDto();
					profesion.idPersona = resp[0].idPersona;
					profesion.idGrupoProfesion = data.idGrupoProfesion;
					profesion.matriculaProfesional = data.matriculaProfesional;
					const resultado = await this._autProfesionPersona.createAutProfesionPersona(profesion);
				}
				return this._respuestaService.respuestaHttp(
					true,
					resp[0].idPersona,
					ruta,
					'La Persona ya se encuentra registrada: idPersona='+resp[0].idPersona,
				);
			}else{
				const newPersona = this._autPersona.create(data);
				let persona = null;
				persona = await this._autPersona.insert(newPersona);
				if(!persona){
					return this._respuestaService.respuestaHttp(
						false,
						null,
						ruta,
						RespuestaConsultaEnum.ERROR_EN_EL_REGISTRO,
					);
				}
				const {raw} = persona;
				const idPersona = +raw[0].id_persona;
				/**Registro en la tabla aut_profesion_persona**/
				const profesion = new CreateAutProfesionPersonaDto();
				profesion.idPersona = idPersona;
				profesion.idGrupoProfesion = data.idGrupoProfesion;
				profesion.matriculaProfesional = data.matriculaProfesional;
				const resultado = await this._autProfesionPersona.createAutProfesionPersona(profesion);
				return this._respuestaService.respuestaHttp(
					true,
					idPersona,
					ruta,
					'La Persona fue registrada exitosamente: idPersona='+idPersona,
				);
				/****/
			}
		}catch (e){
			return this._respuestaService.respuestaHttp(
				false,
				null,
				ruta,
				RespuestaConsultaEnum.ERROR_EN_EL_REGISTRO + e,
			);
		}
	}

	/**SERVICIO PARA EDITAR LOS DATOS DE LA PERSONA Y PROFESION DESDE EL RUES*/
	async updateAutPropietarioRues(id: number, updateAutPropietarioRues: UpdateAutPropietarioRuesDto) {
		const ruta = this._main + '/ updateAutPersonaRues';
		try {
			const persona = await this._autPersona.findOneBy({
				idPersona: id
			  });
			if (!persona)
			  return this._respuestaService.respuestaHttp(
				false,
				null,
				ruta,
				'Registro no Encontrado',
			  );
			  persona.usuarioModificacion = 'postgres';
			  this._autPersona.merge(persona, updateAutPropietarioRues);
			  const updateConsolidado = await this._autPersona.save(persona);
			  /*Actualizamos los datos de la profesion*/
			  const updateProfesionPersona = await this._autProfesionPersona.updateAutProfesionPersona(id,updateAutPropietarioRues);
			  const resp = {
				idPersona: updateConsolidado.idPersona,
			  };
			  return this._respuestaService.respuestaHttp(
				true,
				resp,
				ruta,
				'Modificacion Correcta',
			  );
		  } catch (error) {
			return this._respuestaService.respuestaHttp(
			  false,
			  null,
			  ruta,
			  `Error ${error.message}`,
			);
		  }
	  }
	/**
   *Lista una persona de acuerdo a su Id de Usuario
   * @param id
   */
   async findPersonaByCarnet(carnet: string): Promise<RespuestaM> {
	const ruta = this._main + '/ findOne';
	let persona = null;
	let dataUsuario = null;
	try {
		persona = await this._autPersona.findOne({
			select: {
				idPersona: true,
			},
			where: {
				numeroDocumento: carnet,
				bajaLogicaRegistro: false,
			},
		});
		if (persona) {
			dataUsuario = await this._autUsuarioService.findOne(persona.idPersona);
			if(dataUsuario.status == true){
				return this._respuestaService.respuestaHttp(
					true,
					dataUsuario.data.idPersona,
					ruta,
					RespuestaConsultaEnum.LISTADO_EXITOSO,
				);
			}else{
				return this._respuestaService.respuestaHttp(
					false,
					null,
					ruta,
					RespuestaConsultaEnum.SIN_REGISTRO,
				);
			}
			
		}

	} catch (e) {
		this.logger.error(e);
		return this._respuestaService.respuestaHttp(
			false,
			null,
			ruta,
			`Error ${e.code}`,
		);
	}
}
}
