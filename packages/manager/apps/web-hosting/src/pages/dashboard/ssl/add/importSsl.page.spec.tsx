import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import ImportModal from './importSsl.page';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useParams: () => ({
    serviceName: 'serviceName',
  }),
  useNavigate: () => mockNavigate,
}));

const queryClient = new QueryClient();

describe('ImportModal', () => {
  it('render all text area', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ImportModal />
      </QueryClientProvider>,
    );

    expect(screen.getAllByText('ssl_order_manual_mode_certif')).toHaveLength(1);
    expect(screen.getAllByText('ssl_order_manual_mode_key')).toHaveLength(1);
    expect(screen.getAllByText('ssl_order_manual_mode_chain')).toHaveLength(1);

    expect(screen.getByTestId('ssl-manual-certif')).not.toBeNull();
    expect(screen.getByTestId('ssl-mode-key')).not.toBeNull();
    expect(screen.getByTestId('ssl-mode-chain')).not.toBeNull();
  });

  it('disable validate button when certificate or key is empty', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ImportModal />
      </QueryClientProvider>,
    );

    const primaryBtn = screen.getByTestId('primary-button');
    expect(primaryBtn.getAttribute('is-disabled')).toBe('true');

    fireEvent(
      screen.getByTestId('ssl-manual-certif'),
      new CustomEvent('odsChange', {
        detail: { value: '---CERT---' },
      }),
    );
    expect(primaryBtn.getAttribute('is-disabled')).toBe('true');

    fireEvent(
      screen.getByTestId('ssl-mode-key'),
      new CustomEvent('odsChange', {
        detail: { value: '---KEY---' },
      }),
    );

    expect(primaryBtn.getAttribute('is-disabled')).toBe('false');
  });

  it('call useCreateCertificate with wright data and close modal', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ImportModal />
      </QueryClientProvider>,
    );

    fireEvent(
      screen.getByTestId('ssl-manual-certif'),
      new CustomEvent('odsChange', {
        detail: { value: '---CERT---' },
      }),
    );
    fireEvent(
      screen.getByTestId('ssl-mode-key'),
      new CustomEvent('odsChange', {
        detail: { value: '---KEY---' },
      }),
    );
    fireEvent(
      screen.getByTestId('ssl-mode-chain'),
      new CustomEvent('odsChange', {
        detail: { value: '---CHAIN---' },
      }),
    );

    const primaryBtn = screen.getByTestId('primary-button');
    expect(primaryBtn.getAttribute('is-disabled')).toBe('false');
    await fireEvent.click(primaryBtn);

    expect(mockNavigate).toHaveBeenCalled();
  });

  it('cancel button close modal', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ImportModal />
      </QueryClientProvider>,
    );

    await fireEvent.click(screen.getByTestId('secondary-button'));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
