import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Param,
  Query,
  Put,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginAuthDto } from '../core/domains/dtos/login-auth.dto';
import { UpdateCambiarContraseniaDto } from '../core/domains/dtos/cambiar-contrasenia.dto';

@ApiTags('Autorizacion')
@Controller('api/v1/autorizacion')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Generacion de token mediante usuario y contraseña',
  })
  login(@Body() loginAuthDto: LoginAuthDto) {
    //console.log(loginAuthDto);
    return this.authService.login(
      loginAuthDto.usuario,
      loginAuthDto.contrasenia,
      loginAuthDto.idSistema,
    );
  }

  @Get('verifica-token/:token')
  @ApiOperation({
    summary: 'Metodo para verificar la validez del token',
  })
  getOne(@Param('token') token: string) {
    return this.authService.verify(token);
  }

  @Get('decode-token/:token')
  @ApiOperation({
    summary: 'Metodo para decodificar y obtener información del token generado',
  })
  getDecode(@Param('token') token: string) {
    return this.authService.decode(token);
  }

  @Post('forgot-password/:usuario')
  @ApiOperation({
    summary:
      'Metodo para recuperar la contraseña mediante el envio de correo electrónico para el link',
  })
  mailRestablecerContrasenia(@Param('usuario') usuario: string) {
    return this.authService.mailRestablecerContrasenia(usuario);
  }

  @Post('sendmail/:to/:subject/:text/:html')
  @ApiOperation({
    summary: 'Metodo para enviar correos electronicos',
  })
  sendmail(
    @Param('to') to: string,
    @Param('subject') subject: string,
    @Param('text') text: string,
    @Param('html') html: string,
  ) {
    return this.authService.sendmail(to, subject, text, html);
  }

  @Put('change-password/:username')
  @ApiOperation({ summary: 'Método para cambiar el password asignado.' })
  update(
    @Param('username') username: string,
    @Body() payload: UpdateCambiarContraseniaDto,
  ) {
    return this.authService.update(username, payload);
  }

  @Put('reset-password-default/:username')
  @ApiOperation({ summary: 'Método para resetear el password por defecto.' })
  defaultPassword(@Param('username') username: string) {
    return this.authService.defaultPassword(username);
  }

  @Put('change-password-first/:username')
  @ApiOperation({
    summary: 'Método para cambiar el password asignado por defecto.',
  })
  resetContrasenia(
    @Param('username') username: string,
    @Body() payload: UpdateCambiarContraseniaDto,
  ) {
    return this.authService.resetContrasenia(username, payload);
  }

  @Put('restore-password/:username')
  @ApiOperation({ summary: 'Método para restaurar el password con token.' })
  restaurarContrasenia(
    @Param('username') username: string,
    @Body() payload: UpdateCambiarContraseniaDto,
  ) {
    return this.authService.restaurarContrasenia(username, payload);
  }

  @Get('compare-password/:contrasenia/:contrasenia2')
  @ApiOperation({ summary: 'Método para comparar contraseñas.' })
  comparePas(
    @Param('contrasenia') contrasenia: string,
    @Param('contrasenia2') contrasenia2: string,
  ) {
    //console.log(contrasenia);
    return this.authService.comparePassword(contrasenia, contrasenia2);
  }

  @Post('reset-password-rues/:usuario')
  @ApiOperation({
    summary:
      'Metodo para recuperar la contraseña mediante el envio de correo electrónico para el link',
  })
  mailRestablecerContraseniaRues(@Param('usuario') usuario: string) {
    return this.authService.mailRestablecerContraseniaRues(usuario);
  }
}
