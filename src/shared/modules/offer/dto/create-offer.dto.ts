import { City, Goods, Image, Location, OfferType } from '../../../types/index.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { AdultLimit, DescriptionLimit, OfferConstant, PriceLimit, RoomLimit, TitleLimit } from '../const.js';
import { OfferValidation } from './messages.js';

export class CreateOfferDto {
  @IsString({ message: OfferValidation.title.invalidFormat })
  @Length(TitleLimit.Min, TitleLimit.Max, { message: OfferValidation.title.invalidLength })
  public title: string;

  @IsString({ message: OfferValidation.description.invalidFormat })
  @Length(DescriptionLimit.Min, DescriptionLimit.Max, { message: OfferValidation.description.invalidLength })
  public description: string;

  @IsObject({ message: OfferValidation.city.invalid })
  public city: City;

  @IsString({ message: OfferValidation.previewImage.invalidFormat })
  public previewImage: Image;

  @IsArray({ message: OfferValidation.images.invalidFormat })
  @ArrayMinSize(OfferConstant.ImageCount, { message: OfferValidation.images.invalidValue })
  @ArrayMaxSize(OfferConstant.ImageCount, { message: OfferValidation.images.invalidValue })
  @Matches(/(?:\.png|\.jpg)$/, { each: true, message: OfferValidation.images.invalidFormat })
  public images: Image[];

  @IsBoolean({ message: OfferValidation.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsEnum(OfferType, { message: OfferValidation.type.invalid })
  public type: OfferType;

  @IsNumber({}, { message: OfferValidation.bedrooms.invalidFormat })
  @Min(RoomLimit.Min, { message: OfferValidation.bedrooms.invalidValue })
  @Max(RoomLimit.Max, { message: OfferValidation.bedrooms.invalidValue })
  public bedrooms: number;

  @IsNumber({}, { message: OfferValidation.maxAdults.invalidFormat })
  @Min(AdultLimit.Min, { message: OfferValidation.maxAdults.invalidValue })
  @Max(AdultLimit.Max, { message: OfferValidation.maxAdults.invalidValue })
  public maxAdults: number;

  @IsNumber({}, { message: OfferValidation.price.invalidFormat })
  @Min(PriceLimit.Min, { message: OfferValidation.price.invalidValue })
  @Max(PriceLimit.Max, { message: OfferValidation.price.invalidValue })
  public price: number;

  @IsArray({ message: OfferValidation.goods.invalidFormat })
  @IsString({ each: true, message: OfferValidation.goods.invalidFormat })
  @ArrayMinSize(OfferConstant.GoodsMinimum, { message: OfferValidation.goods.invalidCount })
  public goods: Goods[];

  @ValidateNested({ message: OfferValidation.location.invalid })
  public location: Location;

  public userId: string;
}
