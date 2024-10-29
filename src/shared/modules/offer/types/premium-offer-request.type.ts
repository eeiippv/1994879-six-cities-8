import { Request } from 'express';
import { RequestBody, RequestParams } from '#libs/rest/index.js';
import { CityName } from '#types/city-name.enum.js';

export interface RequestQuery<T> {
  city?: T;
}

export type PremiumOfferRequest = Request<RequestParams, RequestBody, unknown, RequestQuery<CityName>>;
