import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useColumns } from '../useBillingListingColumns.hooks';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn().mockImplementation((key: string) => key),
  }),
}));

const COLUMNS_EXPECTED = [
  `${NAMESPACES.DASHBOARD}:name`,
  `${NAMESPACES.DASHBOARD}:consumption`,
  `${NAMESPACES.FORM}:price`,
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
