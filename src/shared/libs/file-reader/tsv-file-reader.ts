import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { Offer, OfferType, Image, Location, Goods, CityName, UserType } from '../../types/index.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384;

  constructor(private readonly filename: string) {
    super();
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      date,
      cityName,
      cityLocation,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      offerType,
      bedrooms,
      maxAdults,
      price,
      goods,
      userName,
      avatarUrl,
      userType,
      email,
      location,
    ] = line.split('\t');

    return {
      title,
      description,
      postDate: new Date(date),
      city: { name: cityName as CityName, location: this.parseLocation(cityLocation) },
      previewImage,
      images: this.parseImages(images),
      isPremium: this.parseBoolean(isPremium),
      isFavorite: this.parseBoolean(isFavorite),
      rating: Number(rating),
      type: offerType as OfferType,
      bedrooms: Number(bedrooms),
      maxAdults: Number(maxAdults),
      price: this.parsePrice(price),
      goods: this.parseGoods(goods),
      host: { name: userName, avatarUrl, type: userType as UserType, email },
      location: this.parseLocation(location),
    };
  }

  private parseImages(images: string): Image[] {
    return images.split(',').map((image) => image.trim());
  }

  private parseBoolean(value: string): boolean {
    return value.toLowerCase() === 'true';
  }

  private parseLocation(location: string): Location {
    const [latitude, longitude] = location.split(',').map((coord) => Number(coord));
    return { latitude, longitude };
  }

  private parseGoods(goods: string): Goods[] {
    return goods.split(',') as Goods[];
  }

  private parsePrice(price: string): number {
    return Number.parseInt(price, 10);
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        await new Promise((resolve) => this.emit('line', parsedOffer, resolve));
      }
    }

    this.emit('end', importedRowCount);
  }
}
