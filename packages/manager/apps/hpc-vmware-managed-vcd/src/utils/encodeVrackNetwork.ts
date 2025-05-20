const originalSeparator = '/';
const encodedSeparator = '__';

export const encodeVrackNetwork = (raw: string) =>
  raw.replaceAll(originalSeparator, encodedSeparator);

export const decodeVrackNetwork = (encoded: string) =>
  encoded.replaceAll(encodedSeparator, originalSeparator);
