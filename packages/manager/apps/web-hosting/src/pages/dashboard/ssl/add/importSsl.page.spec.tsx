import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { navigate } from '@/utils/test.setup';

import ImportModal from './importSsl.page';

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

  it('call useCreateCertificate with wright data and close modal', () => {
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
    fireEvent.click(primaryBtn);

    expect(navigate).toHaveBeenCalled();
  });

  it('cancel button close modal', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ImportModal />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByTestId('secondary-button'));
    expect(navigate).toHaveBeenCalled();
  });
});
