import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, it } from 'vitest';

import { createWrapper, i18n } from '@/utils/test.provider';

import useDatagridColumn from './useDatagridColumn';

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

describe('useDatagridColumn', () => {
  it('should return correct columns', () => {
    const { result } = renderHook(() => useDatagridColumn(), {
      wrapper: Wrappers as ComponentType,
    });

    const columns = result.current;

    expect(columns).toHaveLength(5);
    expect(columns[0].id).toBe('name');
    expect(columns[1].id).toBe('address');
    expect(columns[2].id).toBe('email');
    expect(columns[3].id).toBe('status');
  });
});
