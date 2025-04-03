import { expect, it } from 'vitest';
import { formatDatagridDate, removeQuotes } from '@/utils/utils';

describe('It displays the manager in the good format', () => {
  it('return the date in dd/MM/yyyy HH:mm for France', () => {
    const testDate = '2025-01-03T11:15:40.311595+01:00';
    expect(formatDatagridDate(testDate, 'fr_FR')).toBe('03/01/2025 10:15');
  });
});

test('remove string if the text contain " at the start and at the end', () => {
  expect(removeQuotes('"test"')).toBe('test');
});
