import { Request } from 'express';
import { RequestBody } from '../../../libs/rest/index.js';
import { ParamOfferId } from './param-offer-id.type.js';
import { UpdateOfferDto } from '../dto/update-offer.dto.js';

export type UpdateOfferRequest = Request<ParamOfferId, RequestBody, UpdateOfferDto>;
