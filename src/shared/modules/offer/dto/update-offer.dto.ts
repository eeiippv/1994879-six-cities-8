import { City, Goods, Image, Location, OfferType } from '../../../types/index.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { AdultLimit, DescriptionLimit, OfferConstant, PriceLimit, RoomLimit, TitleLimit } from '../const.js';
import { OfferValidation } from './messages.js';

export class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: OfferValidation.title.invalidFormat })
  @Length(TitleLimit.Min, TitleLimit.Max, { message: OfferValidation.title.invalidLength })
  public title?: string;

  @IsOptional()
  @IsString({ message: OfferValidation.description.invalidFormat })
  @Length(DescriptionLimit.Min, DescriptionLimit.Max, { message: OfferValidation.description.invalidLength })
  public description?: string;

  @IsOptional()
  @IsObject({ message: OfferValidation.city.invalid })
  public city?: City;

  @IsOptional()
  @IsString({ message: OfferValidation.previewImage.invalidFormat })
  public previewImage?: Image;

  @IsOptional()
  @IsArray({ message: OfferValidation.images.invalidFormat })
  @ArrayMinSize(OfferConstant.ImageCount, { message: OfferValidation.images.invalidValue })
  @ArrayMaxSize(OfferConstant.ImageCount, { message: OfferValidation.images.invalidValue })
  @Matches(/(?:\.png|\.jpg)$/, { each: true, message: OfferValidation.images.invalidFormat })
  public images?: Image[];

  @IsOptional()
  @IsBoolean({ message: OfferValidation.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(OfferType, { message: OfferValidation.type.invalid })
  public type?: OfferType;

  @IsOptional()
  @IsNumber({}, { message: OfferValidation.bedrooms.invalidFormat })
  @Min(RoomLimit.Min, { message: OfferValidation.bedrooms.invalidValue })
  @Max(RoomLimit.Max, { message: OfferValidation.bedrooms.invalidValue })
  public bedrooms?: number;

  @IsOptional()
  @IsNumber({}, { message: OfferValidation.maxAdults.invalidFormat })
  @Min(AdultLimit.Min, { message: OfferValidation.maxAdults.invalidValue })
  @Max(AdultLimit.Max, { message: OfferValidation.maxAdults.invalidValue })
  public maxAdults?: number;

  @IsOptional()
  @IsNumber({}, { message: OfferValidation.price.invalidFormat })
  @Min(PriceLimit.Min, { message: OfferValidation.price.invalidValue })
  @Max(PriceLimit.Max, { message: OfferValidation.price.invalidValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: OfferValidation.goods.invalidFormat })
  @IsString({ each: true, message: OfferValidation.goods.invalidFormat })
  @ArrayMinSize(OfferConstant.GoodsMinimum, { message: OfferValidation.goods.invalidCount })
  public goods?: Goods[];

  @IsOptional()
  @ValidateNested({ message: OfferValidation.location.invalid })
  public location?: Location;
}
