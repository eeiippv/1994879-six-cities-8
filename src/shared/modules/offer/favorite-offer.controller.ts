import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { OfferRoute } from './const.js';
import { fillDto } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { OfferRequest } from './types/offer-request.type.js';

@injectable()
export class FavoriteOfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    const middlewares = [
      new PrivateRouteMiddleware(),
      new ValidateObjectIdMiddleware('offerId'),
      new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
    ];

    this.addRoute({
      path: OfferRoute.Favorite,
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({ path: OfferRoute.OfferFavorite, method: HttpMethod.Post, handler: this.addFavorite, middlewares });
    this.addRoute({ path: OfferRoute.OfferFavorite, method: HttpMethod.Delete, handler: this.deleteFavorite, middlewares });
  }

  public async getFavorites({ tokenPayload }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findByFavorite(tokenPayload.id);
    this.ok(res, fillDto(OfferRdo, offers));
  }

  private async toggleFavorite(
    { params: { offerId }, tokenPayload }: OfferRequest,
    isFavorite: boolean,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.toggleFavorite(tokenPayload.id, offerId, isFavorite);
    this.ok(res, fillDto(OfferRdo, offer));
  }

  public async addFavorite(req: OfferRequest, res: Response): Promise<void> {
    await this.toggleFavorite(req, true, res);
  }

  public async deleteFavorite(req: OfferRequest, res: Response): Promise<void> {
    await this.toggleFavorite(req, false, res);
  }
}
