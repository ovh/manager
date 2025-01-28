import { expect, test } from 'vitest';
import { formatDate, removeString } from '@/utils/utils';

test('return the date in dd/MM/yyyy HH:mm for Europe', () => {
  expect(formatDate('2025-01-03T11:15:40.311595+01:00', 'fr_FR')).toBe(
    '03/01/2025 11:15',
  );
});

test('return the date in MM/dd/yyyy HH:mm for English format', () => {
  expect(formatDate('2025-01-03T11:15:40.311595+01:00', 'en_GB')).toBe(
    '01/03/2025 11:15',
  );
});

test('remove string if the text contain " at the start and at the end', () => {
  expect(removeString('"test"')).toBe('test');
});
