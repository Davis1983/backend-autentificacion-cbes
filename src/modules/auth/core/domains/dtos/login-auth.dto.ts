import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginAuthDto {
  //@Expose()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({ description: `Nombre de usuario.` })
  @Type(() => String)
  usuario: string;

  //@Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiPropertyOptional({ description: `Contraseña del usuario` })
  @Type(() => String)
  contrasenia: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiPropertyOptional({ description: `idSistema` })
  @Type(() => Number)
  idSistema: number;
}
