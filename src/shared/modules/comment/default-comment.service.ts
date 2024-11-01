import { inject, injectable } from 'inversify';
import { DocumentType, mongoose, types } from '@typegoose/typegoose';
import { CommentService } from './comment-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { OfferConstant, RatingLimit } from '../offer/const.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(@inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>) {}

  public async exists(documentId: string): Promise<boolean> {
    return (await this.commentModel.exists({ _id: documentId })) !== null;
  }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('userId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .sort({ createdAt: SortType.Down })
      .limit(OfferConstant.CommentsCount)
      .populate('userId');
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();
    return result.deletedCount;
  }

  public async calculateRatingAndCommentsCount(offerId: string): Promise<[number, number]> {
    const data = await this.commentModel.aggregate([
      { $match: { offerId: new mongoose.Types.ObjectId(offerId) } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' },
        },
      },
      { $unset: '_id' },
    ]);

    if (data.length === 0) {
      return [0, RatingLimit.Min];
    }

    const averageRating = parseFloat(data[0].averageRating.toFixed(1));
    return [averageRating, data[0].count];
  }
}
