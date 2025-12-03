import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';

import { createWrapper, i18n } from '@/utils/test.provider';

import SanModal from './sanSsl.page';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importActual) => {
  return {
    ...(await importActual<typeof import('react-router-dom')>()),
    useParams: () => ({
      serviceName: 'serviceName',
      domain: 'domain',
    }),
    useSearchParams: () => [new URLSearchParams({ san: 'mySAN' })],
    useNavigate: () => mockNavigate,
  };
});

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

describe('SanModal', () => {
  it('call deleteDomainCertificate and close modal', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<SanModal />, { wrapper: Wrappers as ComponentType });

    fireEvent.click(screen.getByTestId('secondary-button'));
    const spy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();

    await window.navigator.clipboard.writeText('mySAN');
    expect(spy).toHaveBeenCalledWith('mySAN');
  });

  it('cancel button close modal', () => {
    render(<SanModal />, { wrapper: Wrappers as ComponentType });

    fireEvent.click(screen.getByTestId('primary-button'));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
