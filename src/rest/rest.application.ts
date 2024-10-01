import { inject, injectable } from 'inversify';
import { Logger } from '#libs/logger/index.js';
import { Config, RestSchema } from '#libs/config/index.js';
import { Component } from '#types/index.js';
import { DatabaseClient } from '#libs/database-client/index.js';
import { getMongoURI } from '#shared/helpers/database.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
  ) {}

  private async initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database...');
    await this.initDb();
    this.logger.info('Init database completed');

    // const user = await UserModel.create({
    //   email: 'test@email.local',
    //   avatarPath: 'keks.jpg',
    //   firstname: 'Keks',
    //   lastname: 'Unknown'
    // });
    // console.log(user);
  }
}
