import got from 'got';
import chalk from 'chalk';
import { Command } from './command.interface.js';
import { MockServerData } from '#types/index.js';
import { TSVOfferGenerator } from '#libs/offer-generator/tsv-offer-generator.js';
import { getErrorMessage } from '#shared/helpers/common.js';
import { TSVFileWriter } from '#shared/libs/file-writer/tsv-file-writer.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(chalk.yellowBright(`File ${chalk.blueBright(filepath)} was created!`));
    } catch (error: unknown) {
      console.error(chalk.bgRed('Can\'t generate data'));
      console.error(chalk.redBright(getErrorMessage(error)));
    }
  }
}
