import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {AutPersonaService} from '../services/impl/aut-persona.service';
import {
	CreateAutPersonaDto, UpdateAutPersonaDto} from '../core/domains/dtos/aut-persona.dto';
import { CreateAutPersonaRuesDto, UpdateAutPersonaRuesDto } from '../core/domains/dtos/aut-persona-rues.dto';
import { CreateAutPropietarioRuesDto, UpdateAutPropietarioRuesDto } from '../core/domains/dtos/aut-propietario-rues.dto';
import {type RespuestaM} from '../../../core/domain/models/respuesta.model';
import {PaginationDto} from '../../../core/domain/dtos/pagination.dto';

@ApiTags('Autorizacion - Aut Persona')
@Controller('api/v1/aut-persona/')
export class AutPersonaController {
	constructor(private readonly _autPersonaService: AutPersonaService) {}

	@Get(':idPersona')
	@ApiOperation({
		summary: 'Buscar los datos de la persona por el idPersona',
	})
	async getOne(
		@Param('idPersona', ParseIntPipe) idPersona: number,
	): Promise<RespuestaM> {
		return this._autPersonaService.findOne(idPersona);
	}

	@Post()
	@ApiOperation({
		summary: 'Crear el registro persona',
	})
	async create(@Body() createPersona: CreateAutPersonaDto) {
		return this._autPersonaService.createAutPersona(createPersona);
	}

	@Post('add-one-persona')
	@ApiOperation({
		summary: 'Crear el registro persona',
	})
	async createOnePersona(@Body() createPersona: CreateAutPersonaDto) {
		return this._autPersonaService.createOnePersona(createPersona);
	}

	@Put(':idPersona')
	@ApiOperation({
		summary: 'Modificar los datos de persona, usuario y profesión',
	})
	async updateAutPersona(@Param('idPersona', ParseIntPipe) idPersona: number,
		@Body() updateAutPersona: UpdateAutPersonaDto) {
		return this._autPersonaService.updateAutPersona(idPersona, updateAutPersona);
	}

	@Get('aut-persona-usuario/:idPersona')
	@ApiOperation({
		summary:
		'Obtiene los datos de la persona, usuario y profesión ',
	})
	findPersonaUsuarioByIdPersona(
		@Param('idPersona', ParseIntPipe) idPersona: number
	): Promise<RespuestaM> {
		return this._autPersonaService.findPersonaUsuarioByIdPersona(
		idPersona
		);
	}

	@Get('aut-pers-usuario/:idPersona')
	@ApiOperation({
		summary:
			'Obtiene los datos de la persona, usuario, profesión, usuario-restriccion, usuario-restriccion-perfil ',
	})
	findByPersonaByIdAllRelation(
		@Param('idPersona', ParseIntPipe) idPersona: number
	): Promise<RespuestaM> {
		return this._autPersonaService.findByPersonaByIdAllRelation(
			idPersona
		);
	}

	@Post('add-persona-rues')
	@ApiOperation({
		summary: 'Crear el registro persona desde el rues para propietario como persona natural',
	})
	async createAutPersonaRues(@Body() createPersona: CreateAutPersonaRuesDto) {
		return this._autPersonaService.createAutPersonaRues(createPersona);
	}

	@Put('update-persona-rues/:idPersona')
	@ApiOperation({
		summary: 'Modificar los datos de persona, y profesión',
	})
	async updateAutPersonaRues(@Param('idPersona', ParseIntPipe) idPersona: number,
		@Body() updateAutPersonaRues: UpdateAutPersonaRuesDto) {
		return this._autPersonaService.updateAutPersonaRues(idPersona, updateAutPersonaRues);
	}

	@Post('add-propietario-rues')
	@ApiOperation({
		summary: 'Crear el registro persona desde el rues para propietario como persona natural',
	})
	async createAutPropietarioRues(@Body() createPropietarioRues: CreateAutPropietarioRuesDto) {
		return this._autPersonaService.createAutPropietarioRues(createPropietarioRues);
	}

	@Put('update-propietario-rues/:idPersona')
	@ApiOperation({
		summary: 'Modificar los datos de persona, y profesión',
	})
	async updateAutPropietarioRues(@Param('idPersona', ParseIntPipe) idPersona: number,
		@Body() updateAutPropietarioRues: UpdateAutPropietarioRuesDto) {
		return this._autPersonaService.updateAutPropietarioRues(idPersona, updateAutPropietarioRues);
	}

	@Get('busca-persona/:carnet')
	@ApiOperation({
		summary:
			'Obtiene los datos de la persona por el numero de carnet ',
	})
	findPersonaByCarnet(
		@Param('carnet') carnet: string
	): Promise<RespuestaM> {
		return this._autPersonaService.findPersonaByCarnet(
			carnet
		);
	}
}
