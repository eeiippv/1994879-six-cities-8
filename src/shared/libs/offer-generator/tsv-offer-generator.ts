import { OfferGenerator } from './offer-generator.interface.js';
import { getRandomBoolean, getRandomDate, getRandomInRange, getRandomItem, getRandomItems } from '#shared/helpers/common.js' ;
import { PriceLimit, RatingLimit, RoomLimit, AdultLimit, OfferConstant, CitiesLocation } from '#shared/modules/offer/const.js';
import { OfferType, MockServerData, CityName, UserType } from '#types/index.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const postDate = getRandomDate().toISOString();
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = Array.from({ length: OfferConstant.ImageCount }, () => getRandomItem<string>(this.mockData.images));
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = getRandomInRange(RatingLimit, 1).toString();
    const type = getRandomItem(Object.keys(OfferType));
    const price = getRandomInRange(PriceLimit);
    const bedrooms = getRandomInRange(RoomLimit);
    const adults = getRandomInRange(AdultLimit);
    const goods = getRandomItems<string>(this.mockData.goods).join(',');
    const userName = getRandomItem(this.mockData.users);
    const avatarUrl = getRandomItem<string>(this.mockData.avatars);
    const userType = getRandomItem<string>(Object.keys(UserType));
    const email = getRandomItem<string>(this.mockData.emails);
    const city = getRandomItem<string>(Object.keys(CityName));
    const { latitude, longitude } = CitiesLocation[city as CityName];
    const cityLocation = `${latitude},${longitude}`;
    const location = getRandomItem<string>(this.mockData.coordinates);

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
      location
    ].join('\t');
  }
}
