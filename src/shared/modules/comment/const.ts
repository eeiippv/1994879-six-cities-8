import { Range } from '../../types/range.interface.js';

export const CommentLimit: Range = {
  Min: 5,
  Max: 1024,
};

export enum CommentRoute {
  OfferId = '/offer/:offerId',
}
