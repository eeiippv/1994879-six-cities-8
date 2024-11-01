import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { UpdateRatingOfferDto } from './dto/update-rating-offer.dto.js';
import { CityName, DocumentExists } from '../../types/index.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  find(count: number, offset: number, userId: string): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  updateRatingById(offerId: string, dto: UpdateRatingOfferDto): Promise<DocumentType<OfferEntity> | null>;
  findByPremium(city: CityName): Promise<DocumentType<OfferEntity>[]>;
  findByFavorite(userId: string): Promise<DocumentType<OfferEntity>[] | null>;
  toggleFavorite(userId: string, offerId: string, isFavorite: boolean): Promise<DocumentType<OfferEntity> | null>;
}
