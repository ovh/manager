import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  WAIT_FOR_DEFAULT_OPTIONS,
  assertTextVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { okmsMock } from '@key-management-service/mocks/kms/okms.mock';
import { credentialMock } from '@key-management-service/mocks/credentials/credentials.mock';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { labels } from '@/common/utils/tests/init.i18n';
import { KMS_FEATURES } from '@/common/utils/feature-availability/feature-availability.constants';

const mockPageUrl = KMS_ROUTES_URLS.credentialDashboard(
  okmsMock[0].id,
  credentialMock[0].id,
);

describe('Credential dashboard test suite', () => {
  it('should display an error if the API is KO', async () => {
    await renderTestApp(mockPageUrl, { isCredentialKO: true });

    await waitFor(
      () => expect(screen.getByAltText('OOPS')).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('should display the credential dashboard page', async () => {
    await renderTestApp(mockPageUrl, { feature: KMS_FEATURES.LOGS });

    await waitFor(() => {
      expect(
        screen.getByText(
          labels.credentials.key_management_service_credential_dashboard_name,
        ),
      ).toBeVisible();
    }, WAIT_FOR_DEFAULT_OPTIONS);
  });

  it(`should navigate back to the credentials list on click on ${labels.credentials.key_management_service_credential_dashboard_backlink}`, async () => {
    const user = userEvent.setup();
    const { container } = await renderTestApp(mockPageUrl);

    const backLink = await getOdsButtonByLabel({
      container,
      label:
        labels.credentials.key_management_service_credential_dashboard_backlink,
      isLink: true,
    });

    user.click(backLink);

    await assertTextVisibility(
      labels.credentials.key_management_service_credential_headline,
    );
  });

  it(`should navigate to the identity page on click on ${labels.credentials.key_management_service_credential_identities} `, async () => {
    const identitiesTabLabel =
      labels.credentials
        .key_management_service_credential_dashboard_tab_identities;
    const userTitleLabel =
      labels.credentials
        .key_management_service_credential_identities_user_title;
    const userGroupsTitleLabel =
      labels.credentials
        .key_management_service_credential_identities_usergroup_title;

    const user = userEvent.setup();
    await renderTestApp(mockPageUrl);

    await waitFor(
      () => expect(screen.getByText(identitiesTabLabel)).toBeEnabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    user.click(screen.getByText(identitiesTabLabel));

    await waitFor(() => {
      expect(screen.getByText(userTitleLabel)).toBeVisible();
      expect(screen.getByText(userGroupsTitleLabel)).toBeVisible();
    }, WAIT_FOR_DEFAULT_OPTIONS);
  });
});
