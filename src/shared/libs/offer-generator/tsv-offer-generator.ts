import { OfferGenerator } from './offer-generator.interface.js';
import {
  applyRandomOffset,
  generateRandomValue,
  getRandomBoolean,
  getRandomDate,
  getRandomInRange,
  getRandomItem,
  getRandomItems,
} from '../../helpers/common.js';
import { PriceLimit, RatingLimit, RoomLimit, AdultLimit, OfferConstant } from '../../modules/offer/const.js';
import { OfferType, MockServerData, CityName, UserType } from '../../types/index.js';
import { CitiesLocation, LocationOffset } from './const.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const postDate = getRandomDate().toISOString();
    const previewImage = getRandomItem(this.mockData.previewImages);
    const images = getRandomItems(this.mockData.images, OfferConstant.ImageCount);
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = getRandomInRange(RatingLimit, 1).toString();
    const type = getRandomItem(Object.values(OfferType));
    const price = getRandomInRange(PriceLimit);
    const bedrooms = getRandomInRange(RoomLimit);
    const adults = getRandomInRange(AdultLimit);
    const goods = getRandomItems(
      this.mockData.goods,
      generateRandomValue(OfferConstant.GoodsMinimum, this.mockData.goods.length - 1)
    ).join(',');
    const userName = getRandomItem(this.mockData.users);
    const avatarUrl = getRandomItem(this.mockData.avatars);
    const userType = getRandomItem(Object.values(UserType));
    const email = getRandomItem(this.mockData.emails);
    const city = getRandomItem(Object.values(CityName));
    const { latitude, longitude } = CitiesLocation[city as CityName];
    const cityLocation = `${latitude},${longitude}`;
    const location = `${applyRandomOffset(latitude, LocationOffset)},${applyRandomOffset(longitude, LocationOffset)}`;

    return [
      title,
      description,
      postDate,
      city,
      cityLocation,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      bedrooms,
      adults,
      price,
      goods,
      userName,
      avatarUrl,
      userType,
      email,
      location,
    ].join('\t');
  }
}
