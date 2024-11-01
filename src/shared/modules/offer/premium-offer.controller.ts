import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { OfferRoute } from './const.js';
import { fillDto } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { PremiumOfferRequest } from './types/premium-offer-request.type.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class PremiumOfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    this.addRoute({ path: OfferRoute.Premium, method: HttpMethod.Get, handler: this.getPremium });
  }

  public async getPremium({ query }: PremiumOfferRequest, res: Response): Promise<void> {
    const city = query.city;
    if (!city) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Invalid city name');
    }
    const offers = await this.offerService.findByPremium(city);
    this.ok(res, fillDto(OfferRdo, offers));
  }
}
