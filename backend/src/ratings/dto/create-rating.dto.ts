import { IsInt, Min, Max, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsUUID()
  storeId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  value: number;
}