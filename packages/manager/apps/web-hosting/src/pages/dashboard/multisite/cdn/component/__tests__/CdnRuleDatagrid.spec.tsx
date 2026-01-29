import { useParams } from 'react-router-dom';

import { render, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import dashboardTranslation from '@/public/translations/dashboard/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

import CdnRuleDatagrid from '../CdnRuleDatagrid';

vi.mock('@/data/hooks/cdn/useCdn', () => ({
  useDeleteCdnOption: vi.fn(() => ({
    deleteCdnOption: vi.fn(),
  })),
  useUpdateCdnOption: vi.fn(() => ({
    updateCdnOption: vi.fn(),
  })),
}));

vi.mock('@/hooks/debouncedValue/useDebouncedValue', () => ({
  useDebouncedValue: vi.fn(() => ['', vi.fn(), '', vi.fn()]),
}));

describe('CdnRuleDatagrid', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({
      serviceName: 'test-service',
      domain: 'test-domain',
    });
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should return correct columns', () => {
    const { getByRole } = render(<CdnRuleDatagrid range="range" />, { wrapper });
    const table = getByRole('table');
    const headers = [
      dashboardTranslation.cdn_shared_option_cache_rule_table_header_order_by,
      dashboardTranslation.cdn_shared_option_cache_rule_table_header_rule_name,
      dashboardTranslation.cdn_shared_option_cache_rule_table_header_resource,
      dashboardTranslation.cdn_shared_option_cache_rule_table_time_to_live,
    ];

    headers.forEach((label) => {
      const columnHeader = within(table).getByRole('columnheader', { name: label });
      expect(columnHeader).toBeInTheDocument();
    });
  });
});
