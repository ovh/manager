import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useBucketColumns } from '../useBucketColumns.hooks';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn().mockImplementation((key: string) => key.split(':')[1] ?? key),
  }),
}));

const COLUMNS_EXPECTED = ['name', 'localisation', 'region'];

describe('useColumns on Listing Page', () => {
  it('Have all required columns in columns array', () => {
    const result = renderHook(useBucketColumns);

    expect(result.result.current.length).toBe(COLUMNS_EXPECTED.length);

    result.result.current.forEach((column) => {
      expect(COLUMNS_EXPECTED.includes(column.label)).toBeTruthy();
    });
  });
});
