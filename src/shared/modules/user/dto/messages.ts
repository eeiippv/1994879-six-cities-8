import { PasswordLimit, UserNameLimit } from '#shared/modules/user/const.js';

export const UserValidation = {
  email: {
    invalidFormat: 'email must be a valid address',
  },
  avatarUrl: {
    invalidFormat: 'avatarPath is required',
  },
  name: {
    invalidFormat: 'name is required',
    invalidLength: `Name length must be between ${UserNameLimit.Min} and ${UserNameLimit.Max}`,
  },
  type: {
    invalid: 'Type must be an pro | regular',
  },
  password: {
    invalidFormat: 'Password is required',
    invalidLength: `Password length must be between ${PasswordLimit.Min} and ${PasswordLimit.Max}`,
  },
};
