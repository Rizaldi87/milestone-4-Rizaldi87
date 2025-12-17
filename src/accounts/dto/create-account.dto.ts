import { IsNumber, IsString, Length } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @Length(6, 6)
  accountNumber: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  balance: number;

  @IsString()
  currency: string;
}
