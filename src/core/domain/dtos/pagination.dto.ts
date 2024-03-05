import { IsOptional, IsPositive } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @Expose()
  @IsOptional()
  @IsPositive()
  @ApiPropertyOptional({ description: 'Limit opcional' })
  @Type(() => Number)
  limit?: number;
  @Expose()
  @IsOptional()
  @ApiPropertyOptional({ description: 'offset opcional' })
  @Type(() => Number)
  offset?: number;
}
