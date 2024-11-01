import { UserType } from '../../../types/index.js';
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { UserNameLimit } from '../const.js';
import { UserValidation } from './messages.js';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: UserValidation.name.invalidFormat })
  @Length(UserNameLimit.Min, UserNameLimit.Max, { message: UserValidation.name.invalidLength })
  public name?: string;

  @IsOptional()
  @IsEnum(UserType, { message: UserValidation.type.invalid })
  public type?: UserType;

  @IsOptional()
  @IsString({ message: UserValidation.avatarUrl.invalidFormat })
  @Matches(/(?:\.png|\.jpg)$/)
  public avatarUrl?: string;
}
