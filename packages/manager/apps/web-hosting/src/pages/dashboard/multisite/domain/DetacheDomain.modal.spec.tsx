import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createWrapper, i18n } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import DetacheDomainModal from './DetacheDomain.modal';

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

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({ t: (k: string) => k }),
    Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
  };
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

describe('DetacheDomainModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should close modal on cancel', () => {
    render(<DetacheDomainModal />, { wrapper: Wrappers as ComponentType });

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    const cancelBtn = screen.getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
  });
});
