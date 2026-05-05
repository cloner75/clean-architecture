import { IsNumber, IsPositive, IsString, Length, Min } from 'class-validator';

export class ChargeDto {
  @IsString()
  @Length(1, 64)
  userId!: string;

  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount!: number;

  @IsString()
  @Length(3, 3)
  currency!: string;
}
