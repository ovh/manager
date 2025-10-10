import React from 'react';

import dashboardTranslation from '@/public/translations/dashboard/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import EditNameModal from '../EditName.modal';

describe('EditName page', () => {
  it('Page for update', async () => {
    const { findByText } = render(<EditNameModal />);
    expect(
      await findByText(dashboardTranslation.hosting_dashboard_modal_update_headline),
    ).toBeVisible();
  });
});
