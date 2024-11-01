import { HttpError } from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';

export class OfferAccessError extends HttpError {
  constructor(offerId: string) {
    super(StatusCodes.FORBIDDEN, `Access deny to Offer ${offerId}`);
  }
}
