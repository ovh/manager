import userEvents from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { renderTest, labels } from '../../../test-utils';
import { organizationList } from '../../../../mocks/vcd-organization/vcd-organization.mock';

describe('Organization Dashboard Page', () => {
  it('display the dashboard page', async () => {
    await renderTest();
    const link = screen.getByText(organizationList[0].currentState.fullName);
    await waitFor(() => userEvents.click(link));

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.dashboard.managed_vcd_dashboard_data_protection,
          ),
        ).toBeVisible(),
      { timeout: 30000 },
    );

    expect(
      screen.getByText(organizationList[0].currentState.description),
    ).toBeVisible();
  });

  it('display an error', async () => {
    await renderTest({
      initialRoute: `/${organizationList[0].id}`,
      isOrganizationKo: true,
    });
    await waitFor(
      () => expect(screen.getByText('Organization error')).toBeVisible(),
      { timeout: 30000 },
    );
  });
});
