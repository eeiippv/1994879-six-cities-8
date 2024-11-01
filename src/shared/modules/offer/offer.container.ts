import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { Controller } from '../../libs/rest/index.js';
import { OfferService, OfferController, PremiumOfferController, FavoriteOfferController } from './index.js';

export function createOfferContainer() {
  const container = new Container();

  container.bind<OfferService>(Component.OfferService).to(DefaultOfferService);
  container.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  container.bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();
  container.bind<Controller>(Component.PremiumOfferController).to(PremiumOfferController).inSingletonScope();
  container.bind<Controller>(Component.FavoriteOfferController).to(FavoriteOfferController).inSingletonScope();

  return container;
}
