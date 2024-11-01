import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { Image, User, UserType } from '../../types/index.js';
import { hashPassword, verifyPassword } from '../../helpers/hash.js';
import { UserNameLimit } from './const.js';
import { Types } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ unique: true, required: true })
  public email: string;

  @prop({ default: '', type: String })
  public avatarUrl: Image;

  @prop({ required: true, minlength: UserNameLimit.Min, maxlength: UserNameLimit.Max })
  public name: string;

  @prop({ required: true, enum: UserType, default: UserType.Regular })
  public type: UserType;

  @prop({ required: true })
  private password?: string;

  @prop({ type: Types.ObjectId, required: true, default: [] })
  public favorites: Types.Array<Types.ObjectId>;

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatarUrl = userData.avatarUrl;
    this.name = userData.name;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = hashPassword(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string): boolean {
    return verifyPassword(password, salt, this.password);
  }
}

export const UserModel = getModelForClass(UserEntity);
