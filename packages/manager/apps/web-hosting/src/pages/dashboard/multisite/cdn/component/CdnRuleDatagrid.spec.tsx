import React, { ComponentType } from 'react';

import { useParams } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createWrapper, i18n } from '@/utils/test.provider';

import CdnRuleDatagrid from './CdnRuleDatagrid';

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

const testQueryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

const RouterWrapper = createWrapper();

const Wrappers = ({ children }: { children: React.ReactElement }) => {
  return (
    <RouterWrapper>
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    </RouterWrapper>
  );
};

describe('CdnRuleDatagrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({
      serviceName: 'test-service',
      domain: 'test-domain',
    });
  });

  it('should return correct columns', () => {
    render(<CdnRuleDatagrid range="range" />, { wrapper: Wrappers as ComponentType });

    expect(screen.getByTestId('header-priority')).not.toBeNull();
    expect(screen.getByTestId('header-rule')).not.toBeNull();
    expect(screen.getByTestId('header-type')).not.toBeNull();
    expect(screen.getByTestId('header-resource')).not.toBeNull();
    expect(screen.getByTestId('header-time')).not.toBeNull();
    expect(screen.getByTestId('header-status')).not.toBeNull();
    expect(screen.getByTestId('header-action')).not.toBeNull();
  });
});
