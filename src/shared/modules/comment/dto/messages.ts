import { RatingLimit } from '../../offer/const.js';
import { CommentLimit } from '../const.js';

export const CommentValidation = {
  comment: {
    invalidFormat: 'Comment must be an string',
    invalidLength: `Comment length must be between ${CommentLimit.Min} and ${CommentLimit.Max}`,
  },
  date: {
    invalidFormat: 'date must be a valid ISO date',
  },
  rating: {
    invalidFormat: 'rating must be an integer (max decimal places = 1)',
    invalidValue: `rating must be between ${RatingLimit.Min} and ${RatingLimit.Max}`,
  },
  offerId: {
    invalid: 'offerId field must be a valid id',
  },
  userId: {
    invalid: 'userId field must be a valid id',
  },
};
