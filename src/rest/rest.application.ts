import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'node:path';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/component.enum.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.js';
import { getMongoURI } from '../shared/helpers/database.js';
import { AppRoute, StaticRoute } from './rest.const.js';
import { ParseTokenMiddleware } from '../shared/libs/rest/middleware/parse-token.middleware.js';
import { getFullServerPath } from '../shared/helpers/common.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

@injectable()
export class RestApplication {
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: ExceptionFilter,
    @inject(Component.CommentController) private readonly commentController: Controller,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.PremiumOfferController) private readonly premiumOfferController: Controller,
    @inject(Component.FavoriteOfferController) private readonly favoriteOfferController: Controller,
    @inject(Component.HttpExceptionFilter) private readonly httpExceptionFilter: ExceptionFilter,
    @inject(Component.ValidationExceptionFilter) private readonly validationExceptionFilter: ExceptionFilter
  ) {
    this.server = express();
  }

  private async initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async initControllers() {
    this.server.use(AppRoute.User, this.userController.router);
    this.server.use(AppRoute.Comment, this.commentController.router);
    this.server.use(AppRoute.Offer, this.premiumOfferController.router);
    this.server.use(AppRoute.Offer, this.favoriteOfferController.router);
    this.server.use(AppRoute.Offer, this.offerController.router);
  }

  private async initMiddleware() {
    this.server.use(express.json());
    this.server.use(StaticRoute.Upload, express.static(this.config.get('UPLOAD_DIRECTORY')));
    this.server.use(StaticRoute.Files, express.static(this.config.get('STATIC_DIRECTORY')));

    const authenticateMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.server.use(cors());
  }

  private async initExceptionFilters() {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.server.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  private initSwagger() {
    const swaggerFilePath = path.resolve(__dirname, '..', '..', 'specification', 'specification.yml');
    const swaggerDocument = YAML.load(swaggerFilePath);
    this.server.use(StaticRoute.ApiDocs, swaggerUI.serve, swaggerUI.setup(swaggerDocument));
  }

  public async init() {
    try {
      this.logger.info('Application initialization');
      this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

      this.initSwagger();

      await Promise.all([this.initDb(), this.initMiddleware(), this.initControllers(), this.initExceptionFilters()]);

      await this.initServer();
      this.logger.info(`Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);
    } catch (error) {
      this.logger.error('Error during application initialization', error as Error);
    }
  }
}
