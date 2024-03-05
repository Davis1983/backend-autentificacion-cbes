import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  IsDate,
  IsEmpty,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { LoginAuthDto } from './login-auth.dto';

export class RegisterAuthDto extends PartialType(LoginAuthDto){
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Nombre de usuario.` })
  readonly usuario: string;
}