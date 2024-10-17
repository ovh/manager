import React from 'react';
import { describe, expect, vi } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import GeneralInformation from '../GeneralInformation';
import { render } from '@/utils/test.provider';
import dashboardTranslation from '@/public/translations/dashboard/Messages_fr_FR.json';
import { organizationDetailMock } from '@/api/_mock_';

describe('General Informations page', () => {
  it('should display page correctly', async () => {
    const { findByText, getByTestId, queryByTestId } = render(
      <GeneralInformation />,
    );

    const title = await findByText(
      dashboardTranslation.zimbra_dashboard_tile_status_title,
    );
    const serviceStatus = queryByTestId('tileblock-orga');
    const accounts = getByTestId('platform-accounts');

    expect(title).toBeVisible();
    expect(serviceStatus).toBeNull();
    expect(accounts).toBeInTheDocument();
  });

  it('should display organization status', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        organizationId: organizationDetailMock.id,
      }),
      vi.fn(),
    ]);

    const { findByText, getByTestId } = render(<GeneralInformation />);

    const title = await findByText(
      dashboardTranslation.zimbra_dashboard_tile_status_title,
    );

    const serviceStatus = getByTestId('tileblock-orga');

    expect(title).toBeVisible();
    expect(serviceStatus).toBeInTheDocument();
  });
});
