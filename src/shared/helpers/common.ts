type Range = {
  Min: number,
  Max: number
};

export function generateRandomValue(min: number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomBoolean(): boolean {
  return Boolean(Math.round(Math.random()));
}

export function getRandomInRange(range: Range, numAfterDigit = 0) {
  return generateRandomValue(range.Min, range.Max, numAfterDigit);
}

export function getRandomItems<T>(items: T[]):T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]):T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getRandomDate(): Date {
  const startDate = new Date('2022-01-01T00:00:00.000Z');
  const endDate = new Date('2030-12-31T23:59:59.999Z');
  const randomTimestamp = Math.floor(Math.random() * (endDate.getTime() - startDate.getTime())) + startDate.getTime();
  return new Date(randomTimestamp);
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}
