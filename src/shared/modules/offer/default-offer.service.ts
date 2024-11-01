import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferService } from './offer-service.interface.js';
import { CityName, Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferConstant } from './const.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { UpdateRatingOfferDto } from './dto/update-rating-offer.dto.js';
import { Types } from 'mongoose';
import { UserEntity } from '../user/user.entity.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);
    return result;
  }

  public async findById(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById(offerId).populate('userId').exec();

    if (!offer) {
      return null;
    }

    const user = await this.userModel.findById(userId).exec();
    if (user && user.favorites) {
      offer.isFavorite = user.favorites.includes(new Types.ObjectId(offerId));
    } else {
      offer.isFavorite = false;
    }
    return offer;
  }

  public async find(
    count: number = OfferConstant.DefaultCount,
    offset: number = 0,
    userId: string
  ): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel.find().skip(offset).limit(count).populate('userId').exec();

    const user = await this.userModel.findById(userId).exec();

    offers.forEach((offer) => ({
      ...offer,
      isFavorite: user ? user.favorites.includes(offer.id) : false,
    }));

    return offers;
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const update = { $set: dto };
    return this.offerModel.findByIdAndUpdate(offerId, update, { new: true }).populate('userId').exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, { $inc: { commentsCount: 1 } }, { new: true }).exec();
  }

  public async updateRatingById(offerId: string, dto: UpdateRatingOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const update = { $set: dto };
    return this.offerModel.findByIdAndUpdate(offerId, update, { new: true }).exec();
  }

  public async findByPremium(cityName: CityName): Promise<DocumentType<OfferEntity>[]> {
    const filter = {
      'city.name': cityName,
      isPremium: true,
    };
    return this.offerModel
      .find(filter)
      .sort({ createdAt: SortType.Down })
      .limit(OfferConstant.PremiumCount)
      .populate('userId')
      .exec();
  }

  public async findByFavorite(userId: string): Promise<DocumentType<OfferEntity>[] | null> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      return null;
    }

    return this.offerModel.find({ _id: { $in: user.favorites } });
  }

  public async toggleFavorite(
    userId: string,
    offerId: string,
    isFavorite: boolean
  ): Promise<DocumentType<OfferEntity> | null> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      return null;
    }

    const offerObjectId = new Types.ObjectId(offerId);

    if (isFavorite) {
      user.favorites.push(offerObjectId);
    } else {
      user.favorites.pull(offerObjectId);
    }

    await user.save();
    return this.findById(offerId, userId);
  }
}
