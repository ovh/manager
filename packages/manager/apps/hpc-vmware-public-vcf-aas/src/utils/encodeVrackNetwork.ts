const originalSeparator = '/';
const encodedSeparator = '__';

export const encodeVrackNetwork = (raw: string) =>
  raw.split(originalSeparator).join(encodedSeparator);

export const decodeVrackNetwork = (encoded: string) =>
  encoded.split(encodedSeparator).join(originalSeparator);
