import React from 'react';

import { useSearchParams } from 'react-router-dom';

import { describe, expect, vi } from 'vitest';

import { organizationMock } from '@/data/api';
import { render, waitFor } from '@/utils/test.provider';

import GeneralInformations from './GeneralInformations.page';

describe('General Informations page', () => {
  it('should display page correctly', () => {
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
    const title = getByTestId('status');

    await waitFor(() => {
      expect(title).toBeVisible();
    });

    const serviceStatus = getByTestId('org-status');
    expect(serviceStatus).toBeInTheDocument();
  });
});
