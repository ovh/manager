import userEvents from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { renderTest, labels } from '../../../test-utils';

describe('Organization Dashboard Page', () => {
  it('display the dashboard page', async () => {
    await renderTest();
    const link = screen.getByText(organizationList[0].currentState.fullName);
    expect(true).toBeTruthy();
    await waitFor(() => userEvents.click(link));

    await assertTextVisibility(
      labels.dashboard.managed_vcd_dashboard_data_protection,
    );

    await assertTextVisibility(organizationList[0].currentState.description);
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}`,
      isOrganizationKo: true,
    });

    await assertTextVisibility('Organization error');
  });
});
