import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createWrapper, i18n } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import AdvancedFlushCdnModal from './AdvancedFlushCdn.modal';

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

describe('AdvancedFlushCdnModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should close modal on cancel', () => {
    render(<AdvancedFlushCdnModal />, { wrapper: Wrappers as ComponentType });

    const cancelBtn = screen.getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
  });

  it('validate and open upgrade cdn page and close modal', () => {
    render(<AdvancedFlushCdnModal />, { wrapper: Wrappers as ComponentType });

    const primaryBtn = screen.getByTestId('primary-button');
    fireEvent.click(primaryBtn);

    expect(window.location.href).toBe('http://localhost:3000/');
  });
});
