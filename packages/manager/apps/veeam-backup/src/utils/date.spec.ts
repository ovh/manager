/* eslint-disable @typescript-eslint/ban-ts-comment */
import { formatDateString } from './date';

describe('formatDateString', () => {
  it('displays - if the date is invalid', () => {
    // @ts-ignore
    expect(formatDateString(undefined)).toBe('-');
    expect(formatDateString('', 'fr-FR')).toBe('-');
  });

  it('displays a valid date if the value is valid', () => {
    // @ts-ignore
    expect(formatDateString(null, 'fr-FR')).toBe('1 janv. 1970');
  });
});
