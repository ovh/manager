import React from 'react';
import { describe, expect, vi } from 'vitest';
import { useParams } from 'react-router-dom';
import UpdateDisplayNameModal from '../UpdateDisplayNameModal.component';
import { render } from '@/utils/test.provider';
import { licensesMock } from '@/api/_mock_';
import dashboardGeneralInformationTranslation from '@/public/translations/dashboard/general-information/Messages_fr_FR.json';

describe('GeneralInformation page', () => {
  it('Page for payAsYouGo', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesMock[0].serviceName,
    });

    const { findByText } = render(<UpdateDisplayNameModal />);

    expect(
      await findByText(
        dashboardGeneralInformationTranslation.dashboard_modal_update_headline,
      ),
    ).toBeVisible();
  });
});
