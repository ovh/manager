import { formatDateString } from './date';

describe('formatDateString', () => {
  it('displays - if the date is invalid', () => {
    expect(formatDateString(undefined)).toBe('-');
  });

  it('displays a valid date if the value is valid', () => {
    expect(formatDateString(null, 'fr-FR')).toBe('1 janv. 1970');
  });
});
