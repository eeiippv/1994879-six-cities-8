import { Range } from '../../types/range.interface.js';

export const OfferConstant = {
  DefaultCount: 60,
  ImageCount: 6,
  PremiumCount: 3,
  CommentsCount: 50,
  GoodsMinimum: 1,
};

export const TitleLimit: Range = {
  Min: 10,
  Max: 100,
};

export const DescriptionLimit: Range = {
  Min: 20,
  Max: 1024,
};

export const PriceLimit: Range = {
  Min: 100,
  Max: 100000,
};

export const RoomLimit: Range = {
  Min: 1,
  Max: 8,
};

export const AdultLimit: Range = {
  Min: 1,
  Max: 10,
};

export const RatingLimit: Range = {
  Min: 1,
  Max: 5,
};

export enum OfferRoute {
  Root = '/',
  OfferId = '/:offerId',
  OfferFavorite = '/:offerId/favorite',
  Favorite = '/favorite',
  Premium = '/premium',
}
