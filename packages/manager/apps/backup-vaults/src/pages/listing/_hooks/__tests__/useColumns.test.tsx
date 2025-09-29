import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ID_LABEL, useColumns } from '@/pages/listing/_hooks/useColumns.hooks';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn().mockImplementation((key: string) => key),
  }),
}));

const COLUMNS_EXPECTED = [
  ID_LABEL,
  'resource_name_label',
  'location_label',
  'region_label',
  'buckets_label',
  'status_label',
];

describe('useColumns on Listing Page', () => {
  it('Have all required columns in columns array', () => {
    const result = renderHook(useColumns);

    expect(result.result.current.length).toBe(COLUMNS_EXPECTED.length);

    result.result.current.forEach((column) => {
      expect(COLUMNS_EXPECTED.includes(column.label)).toBeTruthy();
    });
  });
});
