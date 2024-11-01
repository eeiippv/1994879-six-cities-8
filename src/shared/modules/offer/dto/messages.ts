import {
  AdultLimit,
  DescriptionLimit,
  OfferConstant,
  PriceLimit,
  RatingLimit,
  RoomLimit,
  TitleLimit,
} from '../const.js';

export const OfferValidation = {
  title: {
    invalidFormat: 'title must be an string',
    invalidLength: `Title length must be between ${TitleLimit.Min} and ${TitleLimit.Max}`,
  },
  description: {
    invalidFormat: 'description must be an string',
    invalidLength: `Title length must be between ${DescriptionLimit.Min} and ${DescriptionLimit.Max}`,
  },
  city: {
    invalid: 'city field must be Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf',
  },
  previewImage: {
    invalidFormat: 'previewImage must be an path string for image file',
    maxLength: 'Too short for field «image»',
  },
  images: {
    invalidFormat: 'images must be an array of path string for image file',
    invalidValue: `Length of array images must be ${OfferConstant.ImageCount}`,
  },
  isPremium: {
    invalidFormat: 'isPremium must be an boolean',
  },
  isFavorite: {
    invalidFormat: 'isFavorite must be an boolean',
  },
  type: {
    invalid: 'type field must be Apartment, House, Room, Hotel',
  },
  rating: {
    invalidFormat: 'rating must be an integer (max decimal places = 1)',
    invalidValue: `rating must be between ${RatingLimit.Min} and ${RatingLimit.Max}`,
  },
  commentsCount: {
    invalidFormat: 'commentsCount must be an integer',
  },
  bedrooms: {
    invalidFormat: 'Bedrooms must be an integer',
    invalidValue: `bedrooms must be between ${RoomLimit.Min} and ${RoomLimit.Max}`,
  },
  maxAdults: {
    invalidFormat: 'MaxAdults must be an integer',
    invalidValue: `maxAdults must be between ${AdultLimit.Min} and ${AdultLimit.Max}`,
  },
  price: {
    invalidFormat: 'Price must be an integer',
    invalidValue: `price must be between ${PriceLimit.Min} and ${PriceLimit.Max}`,
  },
  goods: {
    invalidFormat: 'Goods must be string array',
    invalidValue:
      'Goods must be Breakfast | Air conditioning | Laptop friendly workspace | Baby seat | Washer | Towels | Fridge',
    invalidCount: 'At least 1 item required',
  },
  location: {
    invalid: 'Location must be an object with latitude and longitude values',
  },
  offerId: {
    invalid: 'offerId field must be a valid id',
  },
  userId: {
    invalid: 'userId field must be a valid id',
  },
};
