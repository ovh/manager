import React from 'react';
import { describe, expect, vi } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import GeneralInformations from './GeneralInformations.page';
import { render, waitFor } from '@/utils/test.provider';
import { organizationMock } from '@/data/api';

describe('General Informations page', () => {
  it('should display page correctly', async () => {
    const { getByTestId, queryByTestId } = render(<GeneralInformations />);

    const serviceStatus = queryByTestId('org-status');
    const status = getByTestId('status');
    const accounts = getByTestId('platform-accounts');
    const usefulLinks = getByTestId('useful-links');

    expect(serviceStatus).toBeNull();
    expect(status).toBeInTheDocument();
    expect(accounts).toBeInTheDocument();
    expect(usefulLinks).toBeInTheDocument();
  });

  it('should display organization status', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        organizationId: organizationMock.id,
      }),
      vi.fn(),
    ]);

    const { getByTestId } = render(<GeneralInformations />);
    const title = await getByTestId('status');

    await waitFor(() => {
      expect(title).toBeVisible();
    });

    const serviceStatus = getByTestId('org-status');
    expect(serviceStatus).toBeInTheDocument();
  });
});
