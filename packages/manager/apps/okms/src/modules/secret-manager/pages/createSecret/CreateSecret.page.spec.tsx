import {
  assertTextVisibility,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import { waitFor } from '@testing-library/dom';
import {
  DATA_INPUT_TEST_ID,
  MOCK_DATA_VALID_JSON,
  PATH_INPUT_TEST_ID,
  MOCK_PATH_VALID,
  SUBMIT_BTN_TEST_ID,
} from '@secret-manager/utils/tests/secret.constants';
import { fireEvent, act, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { assertBreadcrumbItems } from '@secret-manager/utils/tests/breadcrumb';
import { createSecretErrorMessage } from '@secret-manager/mocks/secrets/secrets.handler';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { catalogMock } from '@/mocks/catalog/catalog.mock';

/* TEST UTILS */
const firstRegion = catalogMock.plans[0].configurations[0].values[0];

const selectRegion = async (user: UserEvent) => {
  const firstRegionRadioCard = screen.getByTestId(firstRegion);

  await act(() => user.click(firstRegionRadioCard));
};

const fillRequiredFields = () => {
  const inputPath = screen.getByTestId(PATH_INPUT_TEST_ID);
  const inputData = screen.getByTestId(DATA_INPUT_TEST_ID);

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
    await assertTextVisibility(
      labels.secretManager.create_secret_form_region_section_title,
    );
    await assertTextVisibility(
      labels.secretManager.create_secret_form_secret_section_title,
    );
  });

  it('should navigate to the created secret page on submit', async () => {
    // GIVEN
    const user = userEvent.setup();
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.createSecret);
    await assertTextVisibility(labels.secretManager.create_a_secret);
    await assertTextVisibility(firstRegion);

    await selectRegion(user);
    fillRequiredFields();

    const submitButton = screen.getByTestId(SUBMIT_BTN_TEST_ID);
    expect(submitButton).toBeInTheDocument();

    await waitFor(() => expect(submitButton).toBeEnabled());

    // WHEN
    await act(() => user.click(submitButton));

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
    fillRequiredFields();

    const submitButton = screen.getByTestId(SUBMIT_BTN_TEST_ID);
    expect(submitButton).toBeInTheDocument();

    await waitFor(() => expect(submitButton).toBeEnabled());

    // WHEN
    await act(() => user.click(submitButton));

    // THEN
    await assertTextVisibility(
      labels.common.error.error_message.replace(
        '{{message}}',
        createSecretErrorMessage,
      ),
    );
  });
});
