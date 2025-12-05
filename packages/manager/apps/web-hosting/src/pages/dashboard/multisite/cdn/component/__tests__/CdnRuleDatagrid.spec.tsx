import { useParams } from 'react-router-dom';

import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';

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
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({
      serviceName: 'test-service',
      domain: 'test-domain',
    });
  });

  it('should return correct columns', () => {
    const { getByTestId } = render(<CdnRuleDatagrid range="range" />, { wrapper });

    expect(getByTestId('header-priority')).not.toBeNull();
    expect(getByTestId('header-rule')).not.toBeNull();
    expect(getByTestId('header-type')).not.toBeNull();
    expect(getByTestId('header-resource')).not.toBeNull();
    expect(getByTestId('header-time')).not.toBeNull();
    expect(getByTestId('header-status')).not.toBeNull();
    expect(getByTestId('header-action')).not.toBeNull();
  });
});
