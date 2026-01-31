import { SECRET_FORM_FIELD_TEST_IDS } from '@secret-manager/components/form/form.constants';
import { createSecretErrorMessage } from '@secret-manager/mocks/secrets/secrets.handler';
import { SECRET_FORM_TEST_IDS } from '@secret-manager/pages/create-secret/SecretForm.constants';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { assertBreadcrumbItems } from '@secret-manager/utils/tests/breadcrumb';
import {
  MOCK_DATA_VALID_JSON,
  MOCK_PATH_VALID,
} from '@secret-manager/utils/tests/secret.constants';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';

import { WAIT_FOR_DEFAULT_OPTIONS, assertTextVisibility } from '@ovh-ux/manager-core-test-utils';

import { catalogMock } from '@/common/mocks/catalog/catalog.mock';
import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { clickJsonEditorToggle } from '@/common/utils/tests/uiTestHelpers';

/* TEST UTILS */
const firstRegion = catalogMock?.plans[0]?.configurations[0]?.values?.[0];

if (!firstRegion) {
  throw new Error('No region found in catalog');
}

/**
 * Selects the first region
 */
const selectRegion = async (user: UserEvent) => {
  const firstRegionRadioCard = screen.getByTestId(firstRegion);

  await act(() => user.click(firstRegionRadioCard));
};

/**
 * Fills the required fields
 */
const fillRequiredFields = () => {
  const inputPath = screen.getByTestId(SECRET_FORM_TEST_IDS.INPUT_PATH);
  const inputData = screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.INPUT_DATA);

  act(() => {
    fireEvent.input(inputPath, {
      target: { value: MOCK_PATH_VALID },
    });

    fireEvent.change(inputData, {
      target: { value: MOCK_DATA_VALID_JSON },
    });
  });
};

/* CREATE PAGE TEST SUITE */
describe('Create secret page test suite', () => {
  it('should display the form sections', async () => {
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.createSecret);

    await assertBreadcrumbItems(['RootBreadcrumbItem']);

    await assertTextVisibility(labels.secretManager.create_a_secret);
    await assertTextVisibility(labels.secretManager.create_secret_form_region_section_title);
    await assertTextVisibility(labels.secretManager.create_secret_form_secret_section_title);
  });

  it('should display the price tile', async () => {
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.createSecret);

    await assertTextVisibility(labels.secretManager.secrets_pricing_title);
    await assertTextVisibility(labels.secretManager.secrets_pricing_subtitle);
  });

  it('should navigate to the created secret page on submit', async () => {
    // GIVEN
    const user = userEvent.setup();
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.createSecret);
    await assertTextVisibility(labels.secretManager.create_a_secret);
    await assertTextVisibility(firstRegion);

    await selectRegion(user);
    await clickJsonEditorToggle(user);
    fillRequiredFields();

    const submitButton = screen.getByTestId(SECRET_FORM_TEST_IDS.SUBMIT_BUTTON);
    expect(submitButton).toBeInTheDocument();

    await waitFor(() => expect(submitButton).toBeEnabled());

    // WHEN
    await act(() => user.click(submitButton));

    // Wait for navigation and loading to complete
    await waitFor(
      () => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(screen.queryByTestId('page-spinner')).not.toBeInTheDocument();
      },
      { timeout: 10_000 },
    );

    // THEN
    // assert we have navigated to the newly created secret page
    expect(
      await screen.findAllByText(
        labels.common.dashboard.general_information,
        {},
        WAIT_FOR_DEFAULT_OPTIONS,
      ),
    ).toHaveLength(2);
  });

  it('should display an error when the creation failed', async () => {
    // GIVEN
    const user = userEvent.setup();
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.createSecret, {
      isCreateSecretKO: true,
    });
    await assertTextVisibility(labels.secretManager.create_a_secret);
    await assertTextVisibility(firstRegion);

    await selectRegion(user);
    await clickJsonEditorToggle(user);
    fillRequiredFields();

    const submitButton = screen.getByTestId(SECRET_FORM_TEST_IDS.SUBMIT_BUTTON);
    expect(submitButton).toBeInTheDocument();

    await waitFor(() => expect(submitButton).toBeEnabled());

    // WHEN
    await act(() => user.click(submitButton));

    // THEN
    await assertTextVisibility(
      labels.common.error.error_message.replace('{{message}}', createSecretErrorMessage),
    );
  });
});
