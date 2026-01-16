import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAgentsListingColumnsHooks } from '../useAgentsListingColumns.hooks';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn().mockImplementation((key: string) => `${key.split(':')[1] || key}_label`),
  }),
}));

const ACTION_COLUMN_LABEL = '';
const COLUMNS_EXPECTED = [
  'name_label',
  'status_label',
  'server_label',
  'address_ip_label',
  'policy_label',
  'data_location_label',
  ACTION_COLUMN_LABEL,
];

describe('useAgentsListingColumnsHooks on Listing Page', () => {
  it('Have all required columns in columns array', () => {
    const result = renderHook(useAgentsListingColumnsHooks);

    expect(result.result.current.length).toBe(COLUMNS_EXPECTED.length);

    result.result.current.forEach((column) => {
      expect(COLUMNS_EXPECTED.includes(column.label)).toBeTruthy();
    });
  });
});
