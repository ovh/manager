import { expect } from 'vitest';
import { removeQuotes } from '@/utils/utils';

test('remove string if the text contain " at the start and at the end', () => {
  expect(removeQuotes('"test"')).toBe('test');
});
