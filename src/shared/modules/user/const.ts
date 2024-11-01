import { Range } from '../../types/range.interface.js';

export const DEFAULT_AVATAR_FILE_NAME = 'default-avatar.svg';

export const UserNameLimit: Range = {
  Min: 1,
  Max: 15,
};

export const PasswordLimit: Range = {
  Min: 6,
  Max: 12,
};

export enum UserRoute {
  Register = '/register',
  Login = '/login',
  Logout = '/logout',
  Avatar = '/:userId/avatar',
}
