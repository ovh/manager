import React from 'react';
import { describe, expect, vi } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import GeneralInformations from './GeneralInformations.page';
import { render } from '@/utils/test.provider';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { organizationMock } from '@/data/api';

describe('General Informations page', () => {
  it('should display page correctly', async () => {
    const { findByText, getByTestId, queryByTestId } = render(
      <GeneralInformations />,
    );

    const title = await findByText(commonTranslation.status);
    const serviceStatus = queryByTestId('org-status');
    const status = getByTestId('status');
    const accounts = getByTestId('platform-accounts');
    const usefulLinks = getByTestId('useful-links');

    expect(title).toBeVisible();
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

    const { findByText, getByTestId } = render(<GeneralInformations />);

    const title = await findByText(commonTranslation.status);

    const serviceStatus = getByTestId('org-status');

    expect(title).toBeVisible();
    expect(serviceStatus).toBeInTheDocument();
  });
});
