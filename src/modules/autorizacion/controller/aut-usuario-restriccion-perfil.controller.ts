import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Post} from "@nestjs/common";
import {AutUsuarioRestriccionPerfilService} from "../services/impl";
import {
    CreateAutUsuarioRestriccionPerfil,
    CreateAutusuarioRestriccionPerfilArray
} from "../core/domains/dtos/aut-usuario-restriccion-perfil.dto";

@ApiTags('Autorizacion - Aut-Usuario Restriccion Perfil')
@Controller('api/v1/aut-usuario-restriccion-perfil/')
export class AutUsuarioRestriccionPerfilController{
    constructor(private _autUsuarioRestriccionPerfilService:AutUsuarioRestriccionPerfilService) {
    }

    /*@Post('adicionar')
    @ApiOperation({
        summary:
            'Adicionar Usuario-Restriccion-Perfil',
    })
    async createAutUsuarioRestriccionPerfil(@Body() dto:CreateAutusuarioRestriccionPerfilArray){
        return this._autUsuarioRestriccionPerfilService.createListAutUsuarioRestriccionPerfil(dto.idUsuarioRestriccion,dto.idPerfil);
    }*/
    @Post('adicionar')
    @ApiOperation({
        summary:
            'Adicionar Usuario-Restriccion-Perfil',
    })
    async createAutUsuarioRestriccionPerfil(@Body() dto:CreateAutUsuarioRestriccionPerfil){
        return this._autUsuarioRestriccionPerfilService.createRestriccionPerfilOne(dto);
    }
}