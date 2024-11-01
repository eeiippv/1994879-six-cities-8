import { inject, injectable } from 'inversify';
import { StaticConfig } from './path-transformer.constant.js';
import { Component } from '../../../types/index.js';
import { Logger } from '../../logger/index.js';
import { getFullServerPath } from '../../../helpers/common.js';
import { RestSchema, Config } from '../../../libs/config/index.js';
import { StaticRoute } from '../../../../rest/rest.const.js';

function isObject(value: unknown): value is Record<string, object> {
  return typeof value === 'object' && value !== null;
}

@injectable()
export class PathTransformer {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {
    this.logger.info('PathTransformer created!');
  }

  private hasDefaultImage(value: string) {
    return StaticConfig.DefaultImages.includes(value);
  }

  private isStaticProperty(property: string) {
    return StaticConfig.ImageFields.includes(property);
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    const stack = [data];
    while (stack.length > 0) {
      const current = stack.pop();

      for (const key in current) {
        if (Object.hasOwn(current, key)) {
          const value = current[key];

          if (isObject(value)) {
            stack.push(value);
            continue;
          }

          if (this.isStaticProperty(key) && typeof value === 'string') {
            const staticPath = StaticRoute.Files;
            const uploadPath = StaticRoute.Upload;
            const serverHost = this.config.get('HOST');
            const serverPort = this.config.get('PORT');

            const rootPath = this.hasDefaultImage(value) ? staticPath : uploadPath;
            current[key] = `${getFullServerPath(serverHost, serverPort)}${rootPath}/${value}`;
          }
        }
      }
    }

    return data;
  }
}
