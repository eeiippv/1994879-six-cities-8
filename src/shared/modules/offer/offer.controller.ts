import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { OfferRoute } from './const.js';
import { CommentService } from '../comment/index.js';
import { fillDto } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { NotFoundOfferError } from './offer.error.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferRequest } from './types/offer-request.type.js';
import { CreateOfferRequest } from './types/create-offer-request.type.js';
import { UpdateOfferRequest } from './types/update-offer-request.type.js';
import { OfferAccessError } from './errors.js';
import { Types } from 'mongoose';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService
  ) {
    super(logger);

    const middlewares = [
      new ValidateObjectIdMiddleware('offerId'),
      new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
    ];
    const privateMiddlewares = [new PrivateRouteMiddleware(), ...middlewares];

    this.addRoute({ path: OfferRoute.Root, method: HttpMethod.Get, handler: this.getAll });
    this.addRoute({
      path: OfferRoute.Root,
      method: HttpMethod.Post,
      handler: this.createOffer,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateOfferDto)],
    });
    this.addRoute({ path: OfferRoute.OfferId, method: HttpMethod.Get, handler: this.getOffer, middlewares });
    this.addRoute({
      path: OfferRoute.OfferId,
      method: HttpMethod.Patch,
      handler: this.updateOffer,
      middlewares: privateMiddlewares,
    });
    this.addRoute({
      path: OfferRoute.OfferId,
      method: HttpMethod.Delete,
      handler: this.deleteOffer,
      middlewares: privateMiddlewares,
    });
  }

  public async getAll({ query, tokenPayload }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find(Number(query.count), Number(query.offset), tokenPayload?.id);
    this.ok(res, fillDto(OfferRdo, offers));
  }

  public async getOffer({ params: { offerId }, tokenPayload }: OfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.findById(offerId, tokenPayload?.id);
    if (!offer) {
      throw new NotFoundOfferError();
    }
    this.ok(res, fillDto(OfferRdo, offer));
  }

  public async createOffer({ body, tokenPayload: { id: userId } }: CreateOfferRequest, res: Response): Promise<void> {
    const newOffer = await this.offerService.create({ ...body, userId });
    const offer = await this.offerService.findById(newOffer.id, userId);
    this.created(res, fillDto(OfferRdo, offer));
  }

  private async checkAccess(offerId: string, userId: string): Promise<void> {
    const offer = await this.offerService.findById(offerId, userId);

    if (!offer?.userId._id.equals(new Types.ObjectId(userId))) {
      throw new OfferAccessError(offerId);
    }
  }

  public async updateOffer(
    { params: { offerId }, body, tokenPayload }: UpdateOfferRequest,
    res: Response
  ): Promise<void> {
    await this.checkAccess(offerId, tokenPayload.id);

    const updatedOffer = await this.offerService.updateById(offerId, body);
    this.ok(res, fillDto(OfferRdo, updatedOffer));
  }

  public async deleteOffer({ params: { offerId }, tokenPayload }: OfferRequest, res: Response): Promise<void> {
    await this.checkAccess(offerId, tokenPayload.id);

    const offer = await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, fillDto(OfferRdo, offer));
  }
}
