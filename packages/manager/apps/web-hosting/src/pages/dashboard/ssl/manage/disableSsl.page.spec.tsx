import React from 'react';
import { v6 } from '@ovh-ux/manager-core-api';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import DisableSslModal from './disableSsl.page';

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
    domain: 'domain',
  }),
  useNavigate: () => mockNavigate,
}));

const queryClient = new QueryClient();

describe('DisableSslModal', () => {
  it('call deleteDomainCertificate and close modal', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DisableSslModal />
      </QueryClientProvider>,
    );

    const primaryBtn = screen.getByTestId('primary-button');
    await fireEvent.click(primaryBtn);

    await waitFor(() => {
      expect(v6.delete).toHaveBeenCalledWith(
        '/hosting/web/serviceName/attachedDomain/domain/ssl',
      );
    });
  });

  it('cancel button close modal', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DisableSslModal />
      </QueryClientProvider>,
    );

    await fireEvent.click(screen.getByTestId('secondary-button'));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
