import React from 'react';

import { useParams } from 'react-router-dom';

import { describe, expect, vi } from 'vitest';

import { licensesMock } from '@/data/api/__mocks__/license';
import dashboardGeneralInformationTranslation from '@/public/translations/dashboard/general-information/Messages_fr_FR.json';
import { render } from '@/utils/Test.provider';

import UpdateDisplayNameModal from '../UpdateDisplayName.modal';

describe('GeneralInformation page', () => {
  it('Page for payAsYouGo', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: licensesMock[0].serviceName,
    });

    const { findByText } = render(<UpdateDisplayNameModal />);

    expect(
      await findByText(dashboardGeneralInformationTranslation.dashboard_modal_update_headline),
    ).toBeVisible();
  });
});
