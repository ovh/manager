import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { navigate } from '@/utils/test.setup';

import DisableSslModal from './disableSsl.page';

const { mockDelete } = vi.hoisted(() => ({
  mockDelete: vi.fn(),
}));

vi.mock('@ovh-ux/manager-core-api', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    v6: {
      delete: mockDelete,
    },
  };
});

const queryClient = new QueryClient();

describe('DisableSslModal', () => {
  it('call deleteDomainCertificate and close modal', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DisableSslModal />
      </QueryClientProvider>,
    );

    const primaryBtn = screen.getByTestId('primary-button');
    fireEvent.click(primaryBtn);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('/hosting/web/serviceName/attachedDomain/domain/ssl');
    });
  });

  it('cancel button close modal', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DisableSslModal />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByTestId('secondary-button'));
    expect(navigate).toHaveBeenCalled();
  });
});
