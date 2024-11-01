import { IsNumber, IsString, Length, Max, Min } from 'class-validator';
import { CommentLimit } from '../const.js';
import { RatingLimit } from '../../offer/const.js';
import { CommentValidation } from './messages.js';

export class CreateCommentDto {
  @IsString({ message: CommentValidation.comment.invalidFormat })
  @Length(CommentLimit.Min, CommentLimit.Max, { message: CommentValidation.comment.invalidLength })
  public comment: string;

  @IsNumber({ maxDecimalPlaces: 1 }, { message: CommentValidation.rating.invalidFormat })
  @Min(RatingLimit.Min, { message: CommentValidation.rating.invalidValue })
  @Max(RatingLimit.Max, { message: CommentValidation.rating.invalidValue })
  public rating: number;

  public offerId: string;

  public userId: string;
}
