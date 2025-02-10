import { expect, it } from 'vitest';
import { formatDate, removeString } from '@/utils/utils';

describe('It displays the manager in the good format', () => {
  it('return the date in dd/MM/yyyy HH:mm for France', () => {
    expect(formatDate('2025-01-03T11:15:40.311595+01:00', 'fr_FR')).toBe(
      '03/01/2025 10:15',
    );
  });
});

test('remove string if the text contain " at the start and at the end', () => {
  expect(removeString('"test"')).toBe('test');
});
