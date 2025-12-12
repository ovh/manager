import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';

import { createWrapper, i18n } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import DisableSslModal from './disableSsl.page';

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

const { mockDelete } = vi.hoisted(() => ({
  mockDelete: vi.fn(),
}));
vi.mock(
  '@ovh-ux/manager-core-api',
  async (importOriginal: () => Promise<typeof import('@ovh-ux/manager-core-api')>) => {
    const actual = await importOriginal();
    return {
      ...actual,
      v6: {
        delete: mockDelete,
      },
    };
  },
);

vi.mock('@/data/hooks/ssl/useSsl', () => ({
  useDeleteDomainCertificate: vi.fn((serviceName: string) => ({
    deleteDomainCertificate: (domain: string) => {
      mockDelete(`/hosting/web/${serviceName}/attachedDomain/${domain}/ssl`);
    },
  })),
}));

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

describe('DisableSslModal', () => {
  it('call deleteDomainCertificate and close modal', async () => {
    render(<DisableSslModal />, { wrapper: Wrappers as ComponentType });

    const primaryBtn = screen.getByTestId('primary-button');
    fireEvent.click(primaryBtn);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('/hosting/web/serviceName/attachedDomain/domain/ssl');
    });
  });

  it('cancel button close modal', () => {
    render(<DisableSslModal />, { wrapper: Wrappers as ComponentType });

    fireEvent.click(screen.getByTestId('secondary-button'));
    expect(navigate).toHaveBeenCalled();
  });
});
