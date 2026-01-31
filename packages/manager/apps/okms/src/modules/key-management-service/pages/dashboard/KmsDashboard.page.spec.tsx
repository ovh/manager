import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';

import { KMS_FEATURES } from '@/common/utils/feature-availability/feature-availability.constants';
import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { TIMEOUT, assertModalVisibility } from '@/common/utils/tests/uiTestHelpers';
import { SERVICE_KEYS_LABEL } from '@/constants';

import { kmsDashboardTabNames } from './kmsDashboard.constants';

const mockedOkms = okmsRoubaix1Mock;
const mockPageUrl = KMS_ROUTES_URLS.kmsDashboard(mockedOkms.id);

// We mock @ovh-ux/manager-billing-informations module because it takes 3 secondes to load
// And make the test suite slow
vi.mock('@ovh-ux/manager-billing-informations', () => ({
  BillingInformationsTileStandard: vi.fn(() => <div>BillingInformationsTileStandard</div>),
}));

describe('KMS dashboard test suite', () => {
  it('should display an error if the API is KO', async () => {
    await renderTestApp(mockPageUrl, { isOkmsKO: true });

    await waitFor(() => expect(screen.getByAltText('OOPS')).toBeInTheDocument(), {
      timeout: 10_000,
    });
  });

  it('should display the kms dashboard page', async () => {
    await renderTestApp(mockPageUrl, { feature: KMS_FEATURES.LOGS });

    await waitFor(
      () => {
        expect(screen.getByTestId(kmsDashboardTabNames.generalInformation)).toBeVisible();
        expect(screen.getByTestId(kmsDashboardTabNames.serviceKeys)).toBeVisible();
        expect(screen.getByTestId(kmsDashboardTabNames.credentials)).toBeVisible();
        expect(screen.getByTestId(kmsDashboardTabNames.logs)).toBeVisible();
      },
      { timeout: 5_000 },
    );

    expect(screen.queryByAltText('OOPS')).not.toBeInTheDocument();
  });

  it(`should navigate back to the kms list on click on ${labels.dashboard.key_management_service_dashboard_back_link}`, async () => {
    const user = userEvent.setup();
    await renderTestApp(mockPageUrl);

    const backLink = await screen.findByText(
      labels.dashboard.key_management_service_dashboard_back_link,
      {},
      { timeout: TIMEOUT.MEDIUM },
    );

    await act(() => user.click(backLink));

    await assertTextVisibility(labels.listing.key_management_service_listing_title);
  });

  it(`should navigate to the service key page on click on ${SERVICE_KEYS_LABEL} `, async () => {
    const user = userEvent.setup();
    await renderTestApp(mockPageUrl);

    await waitFor(() => expect(screen.getByTestId(kmsDashboardTabNames.serviceKeys)).toBeEnabled());

    await act(async () => {
      await user.click(screen.getByTestId(kmsDashboardTabNames.serviceKeys));
    });

    await waitFor(() =>
      expect(
        screen.getByText(labels.serviceKeys['key_management_service_service-keys_headline']),
      ).toBeVisible(),
    );
  });

  it(`should navigate to the credential page on click on ${labels.dashboard.access_certificates} `, async () => {
    const user = userEvent.setup();
    await renderTestApp(mockPageUrl);

    await waitFor(() => expect(screen.getByTestId(kmsDashboardTabNames.credentials)).toBeEnabled());

    await act(async () => {
      await user.click(screen.getByText(labels.dashboard.access_certificates));
    });

    await waitFor(() =>
      expect(
        screen.getByText(labels.credentials.key_management_service_credential_headline),
      ).toBeVisible(),
    );
  });

  it('should navigate to the rename modal on click on rename button', async () => {
    const user = userEvent.setup();
    await renderTestApp(mockPageUrl);

    await waitFor(() => expect(screen.getByLabelText('edit')).toBeEnabled());

    await act(async () => {
      await user.click(screen.getByLabelText('edit'));
    });

    // Wait for modal to open
    await assertModalVisibility({ role: 'dialog' });

    expect(await screen.findByText(labels.common.actions.modify_name)).toBeVisible();
  });
});
