import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';

import { createWrapper, i18n } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import ImportModal from './importSsl.page';

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

describe('ImportModal', () => {
  it('render all text area', () => {
    render(<ImportModal />, { wrapper: Wrappers as ComponentType });

    expect(screen.getAllByText('ssl_order_manual_mode_certif')).toHaveLength(1);
    expect(screen.getAllByText('ssl_order_manual_mode_key')).toHaveLength(1);
    expect(screen.getAllByText('ssl_order_manual_mode_chain')).toHaveLength(1);

    expect(screen.getByTestId('ssl-manual-certif')).not.toBeNull();
    expect(screen.getByTestId('ssl-mode-key')).not.toBeNull();
    expect(screen.getByTestId('ssl-mode-chain')).not.toBeNull();
  });

  it('disable validate button when certificate or key is empty', () => {
    render(<ImportModal />, { wrapper: Wrappers as ComponentType });

    const primaryBtn = screen.getByTestId('primary-button');
    expect(primaryBtn).toBeDisabled();

    fireEvent.change(screen.getByTestId('ssl-manual-certif'), {
      target: { value: '---CERT---' },
    });
    expect(primaryBtn).toBeDisabled();

    fireEvent.change(screen.getByTestId('ssl-mode-key'), {
      target: { value: '---KEY---' },
    });

    expect(primaryBtn).not.toBeDisabled();
  });

  it('call useCreateCertificate with wright data and close modal', () => {
    render(<ImportModal />, { wrapper: Wrappers as ComponentType });

    fireEvent.change(screen.getByTestId('ssl-manual-certif'), {
      target: { value: '---CERT---' },
    });
    fireEvent.change(screen.getByTestId('ssl-mode-key'), {
      target: { value: '---KEY---' },
    });
    fireEvent.change(screen.getByTestId('ssl-mode-chain'), {
      target: { value: '---CHAIN---' },
    });

    const primaryBtn = screen.getByTestId('primary-button');
    expect(primaryBtn).not.toBeDisabled();
    fireEvent.click(primaryBtn);

    expect(navigate).toHaveBeenCalled();
  });

  it('cancel button close modal', () => {
    render(<ImportModal />, { wrapper: Wrappers as ComponentType });

    fireEvent.click(screen.getByTestId('secondary-button'));
    expect(navigate).toHaveBeenCalled();
  });
});
