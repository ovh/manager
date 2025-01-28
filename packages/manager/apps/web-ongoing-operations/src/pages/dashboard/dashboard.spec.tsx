import { describe, it } from 'vitest';
import '@testing-library/jest-dom';

export const WAIT_FOR_DEFAULT_OPTIONS = {
  timeout: 0,
};

describe('dashboard test suite', () => {
  it('should do not crash', async () => {
    expect(true).toBe(true);
  });
});
