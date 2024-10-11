import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
import { BaseController, HttpMethod } from '#libs/rest/index.js';
import { Logger } from '#libs/logger/index.js';
import { Component } from '#types/index.js';
import { CommentService } from '../comment/index.js';
import { CommentRoute } from './const.js';
import { fillDto } from '#shared/helpers/common.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { OfferService } from '../offer/offer-service.interface.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.addRoute({ path: CommentRoute.OfferId, method: HttpMethod.Get, handler: this.getComments });
    this.addRoute({ path: CommentRoute.OfferId, method: HttpMethod.Post, handler: this.createComment });
  }

  public async getComments(req: Request, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(req.params.offerId);
    this.ok(res, fillDto(CommentRdo, comments));
  }

  public async createComment(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const comment = await this.commentService.create({...req.body, offerId: offerId});
    const [ rating, commentsCount ] = await this.commentService.calculateRatingAndCommentsCount(offerId);
    await this.offerService.updateRatingById(offerId, { rating, commentsCount });
    this.created(res, fillDto(CommentRdo, comment));
  }
}
