import { City, Location, OfferType, Goods } from '../../../types/index.js';
import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose({ name: 'createdAt' })
  public postDate: Date;

  @Expose()
  public city: City;

  @Expose()
  public previewImage: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: OfferType;

  @Expose()
  public location: Location;

  @Expose()
  public price: number;

  @Expose()
  public commentsCount: number;

  @Expose()
  public description: string;

  @Expose()
  public images: string[];

  @Expose()
  public bedrooms: number;

  @Expose()
  public maxAdults: number;

  @Expose()
  public goods: Goods[];

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public host: UserRdo;
}
