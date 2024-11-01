import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
import {
  BaseController,
  HttpMethod,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateUserRequest, LoginUserRequest } from './user-request.type.js';
import { UserService } from './user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDto } from '../../helpers/common.js';
import { UserRdo } from './rdo/user.rdo.js';
import { UnauthorizedError, UserAlreadyExistsError } from './errors.js';
import { UserRoute } from './const.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { AuthService } from '../auth/auth-service.interface.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';
import { UploadUserAvatarRdo } from './rdo/upload-user-avatar.rdo.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService
  ) {
    super(logger);

    this.addRoute({
      path: UserRoute.Register,
      method: HttpMethod.Post,
      handler: this.createUser,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });
    this.addRoute({
      path: UserRoute.Login,
      method: HttpMethod.Post,
      handler: this.login,
    });
    this.addRoute({ path: UserRoute.Login, method: HttpMethod.Get, handler: this.checkAuthenticate });
    this.addRoute({
      path: UserRoute.Logout,
      method: HttpMethod.Delete,
      handler: this.logout,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: UserRoute.Avatar,
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ],
    });
  }

  public async createUser({ body }: CreateUserRequest, res: Response): Promise<void> {
    const { email } = body;
    const existsUser = await this.userService.findByEmail(email);

    if (existsUser) {
      throw new UserAlreadyExistsError(email);
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDto(UserRdo, result));
  }

  public async login({ body }: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDto(LoggedUserRdo, user);
    this.ok(res, Object.assign(responseData, { token }));
  }

  public async checkAuthenticate({ tokenPayload }: Request, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(tokenPayload?.email);
    if (!user) {
      throw new UnauthorizedError();
    }

    this.ok(res, fillDto(LoggedUserRdo, user));
  }

  public async logout(_req: Request, res: Response) {
    this.noContent(res, { message: 'Call logout' });
  }

  public async uploadAvatar({ tokenPayload: { id: userId }, file }: Request, res: Response) {
    const uploadFile = { avatarUrl: file?.filename };
    await this.userService.updateById(userId, uploadFile);
    this.created(res, fillDto(UploadUserAvatarRdo, { avatarUrl: uploadFile.avatarUrl }));
  }
}
