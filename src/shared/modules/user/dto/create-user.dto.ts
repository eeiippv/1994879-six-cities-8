import { UserType } from '../../../types/index.js';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { PasswordLimit, UserNameLimit } from '../const.js';
import { UserValidation } from './messages.js';

export class CreateUserDto {
  @IsString({ message: UserValidation.name.invalidFormat })
  @Length(UserNameLimit.Min, UserNameLimit.Max, { message: UserValidation.name.invalidLength })
  public name: string;

  @IsEnum(UserType, { message: UserValidation.type.invalid })
  public type: UserType;

  @IsEmail({}, { message: UserValidation.email.invalidFormat })
  public email: string;

  @IsString({ message: UserValidation.password.invalidFormat })
  @Length(PasswordLimit.Min, PasswordLimit.Max, { message: UserValidation.password.invalidLength })
  public password: string;
}
