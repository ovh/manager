import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { Matcher, MatcherOptions, waitFor } from '@testing-library/dom';
import {
  DATA_INPUT_TEST_ID,
  DATA_VALID_JSON,
  PATH_INPUT_TEST_ID,
  PATH_VALID,
  SUBMIT_BTN_TEST_ID,
} from '@secret-manager/utils/tests/secret.constant';
import { fireEvent, act } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { catalogMock } from '@/mocks/catalog/catalog.mock';

/* TEST UTILS */
const firstRegion = catalogMock.plans[0].configurations[0].values[0];

const selectRegion = async (
  getByTestId: (id: Matcher, options?: MatcherOptions) => HTMLElement,
  user: UserEvent,
) => {
  const firstRegionRadioCard = getByTestId(firstRegion);

  await act(() => user.click(firstRegionRadioCard));
};

const fillRequiredFields = (
  getByTestId: (id: Matcher, options?: MatcherOptions) => HTMLElement,
) => {
  const inputPath = getByTestId(PATH_INPUT_TEST_ID);
  const inputData = getByTestId(DATA_INPUT_TEST_ID);

  act(() => {
    fireEvent.input(inputPath, {
      target: { value: PATH_VALID },
    });

    fireEvent.change(inputData, {
      target: { value: DATA_VALID_JSON },
    });
  });
};

/* CREATE PAGE TEST SUITE */
describe('Create secret page test suite', () => {
  it('should display the form sections', async () => {
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.secretCreate);

    await assertTextVisibility(labels.secretManager.create.title);
    await assertTextVisibility(
      labels.secretManager.create.domain_section_title,
    );
    await assertTextVisibility(
      labels.secretManager.create.secret_section_title,
    );
    await assertTextVisibility(
      labels.secretManager.create.paiement_section_title,
    );
  });

  it('should navigate to the created secret page on submit', async () => {
    // GIVEN
    const user = userEvent.setup();
    const { getByTestId } = await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.secretCreate,
    );
    await assertTextVisibility(labels.secretManager.create.title);
    await assertTextVisibility(firstRegion);

    await selectRegion(getByTestId, user);
    fillRequiredFields(getByTestId);

    const submitButton = getByTestId(SUBMIT_BTN_TEST_ID);
    expect(submitButton).toBeInTheDocument();

    await waitFor(() => expect(submitButton).not.toHaveAttribute('disabled'), {
      timeout: 10_000,
    });

    // WHEN
    await act(() => user.click(submitButton));

    // THEN
    // assert we have navigated to the newly created secret page
    // TODO: update when detail page is done
    await assertTextVisibility('Secret Detail');
  });

  it('should display an error when the creation failed', async () => {
    // GIVEN
    const user = userEvent.setup();
    const { getByTestId } = await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.secretCreate,
      {
        isCreateSecretKO: true,
      },
    );
    await assertTextVisibility(labels.secretManager.create.title);
    await assertTextVisibility(firstRegion);

    await selectRegion(getByTestId, user);
    fillRequiredFields(getByTestId);

    const submitButton = getByTestId(SUBMIT_BTN_TEST_ID);
    expect(submitButton).toBeInTheDocument();

    await waitFor(() => expect(submitButton).not.toHaveAttribute('disabled'), {
      timeout: 10_000,
    });
    // WHEN
    await act(() => user.click(submitButton));

    // THEN
    await assertTextVisibility('error_message');
  });
});
