import {
  assertTextVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
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
import {
  SECRET_MANAGER_ROUTES_URLS,
  SECRET_MANAGER_SEARCH_PARAMS,
} from '@secret-manager/routes/routes.constants';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { catalogMock } from '@/mocks/catalog/catalog.mock';
import { okmsMock } from '@/mocks/kms/okms.mock';

/* TEST UTILS */
const selectDomain = async (
  getByTestId: (id: Matcher, options?: MatcherOptions) => HTMLElement,
  user: UserEvent,
) => {
  const firstRegion = catalogMock.plans[0].configurations[0].values[0];

  await assertTextVisibility(firstRegion);

  const firstRegionRadioCard = getByTestId(firstRegion);
  const regionDomainList = okmsMock.filter(
    (domain) => domain.region === firstRegion,
  );
  act(() => {
    user.click(firstRegionRadioCard);
  });

  await waitFor(() => {
    // assert we display the correct domain list
    // assert that the first domain is selected
    regionDomainList.forEach((domain, index) => {
      assertTextVisibility(domain.iam.displayName);
      const domainRadioCard = getByTestId(domain.id);
      if (index === 0) {
        expect(domainRadioCard).toBeChecked();
        return;
      }
      expect(domainRadioCard).not.toBeChecked();
    });
  });
};

const assertInitialRegionAndDomainList = async (
  getByTestId: (id: Matcher, options?: MatcherOptions) => HTMLElement,
  queryByTestId: (id: Matcher, options?: MatcherOptions) => HTMLElement,
) => {
  const availableRegions = catalogMock.plans[0].configurations[0].values;
  await waitFor(
    () => {
      // assert that we display the correct region list
      // assert that none of the region radioCards are selected
      availableRegions.forEach((region) => {
        const regionRadioCard = getByTestId(region);
        expect(regionRadioCard).not.toBeChecked();
      });

      // assert that no domain radioCard are displayed
      okmsMock.forEach((domain) => {
        expect(queryByTestId(domain.id)).toBeNull();
      });
    },
    { timeout: 10_000 },
  );
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

const clickBackLink = async (container: HTMLElement, user: UserEvent) => {
  const backLink = await getOdsButtonByLabel({
    container,
    label: 'back',
    isLink: true,
  });

  act(() => {
    user.click(backLink);
  });
};

/* CREATE PAGE TEST SUITE */
describe('Create secret page test suite', () => {
  it('should display the form sections', async () => {
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.secretCreate);

    assertTextVisibility(labels.secretManager.create.title);
    assertTextVisibility(labels.secretManager.create.domain_section_title);
    assertTextVisibility(labels.secretManager.create.secret_section_title);
    assertTextVisibility(labels.secretManager.create.paiement_section_title);
  });
});

/* DOMAIN MANAGEMENT TEST SUITE */
describe('Domain management test suite', () => {
  it('should display the available region list', async () => {
    // GIVEN
    // WHEN
    const { getByTestId, queryByTestId } = await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.secretCreate,
    );
    await assertTextVisibility(labels.secretManager.create.title);

    // THEN
    const regionsSpinner = getByTestId('regionsSpinner');
    expect(regionsSpinner).toBeVisible();

    assertInitialRegionAndDomainList(getByTestId, queryByTestId);
  });

  it('should display a filtered domain list and select the first one on a region selection', async () => {
    const user = userEvent.setup();
    // GIVEN
    // WHEN
    const { getByTestId } = await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.secretCreate,
    );
    await assertTextVisibility(labels.secretManager.create.title);

    // THEN
    selectDomain(getByTestId, user);
  });

  describe('When there is a domainId search param', () => {
    it('should pre-select the right region and domain', async () => {
      // GIVEN
      const mockDomainId = okmsMock[0].id;

      // WHEN
      const { getByTestId } = await renderTestApp(
        `${SECRET_MANAGER_ROUTES_URLS.secretCreate}?${SECRET_MANAGER_SEARCH_PARAMS.domainId}=${mockDomainId}`,
      );
      await assertTextVisibility(labels.secretManager.create.title);

      // THEN
      const currentDomain = okmsMock.find(
        (domain) => domain.id === mockDomainId,
      );
      const currentRegion = currentDomain.region;
      await waitFor(
        () => {
          // assert the correct region RadioCard and Domain RadioCard are checked
          const regionRadioCard = getByTestId(currentRegion);
          expect(regionRadioCard).toBeChecked();
          const domainRadioCard = getByTestId(currentDomain.id);
          expect(domainRadioCard).toBeChecked();
        },
        { timeout: 10_000 },
      );
    });

    it('should ignore domainId if it does not exist', async () => {
      // GIVEN
      const mockDomainId = '123456';

      // WHEN
      const { getByTestId, queryByTestId } = await renderTestApp(
        `${SECRET_MANAGER_ROUTES_URLS.secretCreate}?${SECRET_MANAGER_SEARCH_PARAMS.domainId}=${mockDomainId}`,
      );
      await assertTextVisibility(labels.secretManager.create.title);

      // THEN
      assertInitialRegionAndDomainList(getByTestId, queryByTestId);
    });
  });
});

/* FORM MANAGEMENT TEST SUITE */

type TestCase = {
  path?: string;
  data?: string;
  selectedDomainId: boolean;
  shouldButtonBeDisabled: boolean;
};

const testCases: TestCase[] = [
  { selectedDomainId: false, shouldButtonBeDisabled: true },
  {
    data: DATA_VALID_JSON,
    selectedDomainId: false,
    shouldButtonBeDisabled: true,
  },
  {
    path: PATH_VALID,
    selectedDomainId: false,
    shouldButtonBeDisabled: true,
  },
  { selectedDomainId: true, shouldButtonBeDisabled: true },
  {
    data: DATA_VALID_JSON,
    path: PATH_VALID,
    selectedDomainId: false,
    shouldButtonBeDisabled: true,
  },
  {
    data: DATA_VALID_JSON,
    path: PATH_VALID,
    selectedDomainId: true,
    shouldButtonBeDisabled: false,
  },
];

describe('Secrets creation form test suite', () => {
  it.each(testCases)(
    'should check the form validity for data: $data, path: $path and a selectedDomain: $selectedDomainId ',
    async ({ data, path, selectedDomainId, shouldButtonBeDisabled }) => {
      const user = userEvent.setup();
      // GIVEN
      const { getByTestId } = await renderTestApp(
        SECRET_MANAGER_ROUTES_URLS.secretCreate,
      );
      await assertTextVisibility(labels.secretManager.create.title);

      const inputPath = getByTestId(PATH_INPUT_TEST_ID);
      expect(inputPath).toBeInTheDocument();
      const inputData = getByTestId(DATA_INPUT_TEST_ID);
      expect(inputData).toBeInTheDocument();
      const submitButton = getByTestId(SUBMIT_BTN_TEST_ID);
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('is-disabled', 'true');

      // WHEN
      act(() => {
        fireEvent.input(inputPath, {
          target: { value: path },
        });

        fireEvent.change(inputData, {
          target: { value: data },
        });
      });

      if (selectedDomainId) await selectDomain(getByTestId, user);

      // THEN
      await waitFor(
        () => {
          expect(submitButton).toHaveAttribute(
            'is-disabled',
            shouldButtonBeDisabled.toString(),
          );
        },
        { timeout: 10_000 },
      );
    },
  );

  it('should navigate to the created secret page on submit', async () => {
    // GIVEN
    const user = userEvent.setup();
    const { getByTestId } = await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.secretCreate,
    );
    await assertTextVisibility(labels.secretManager.create.title);

    selectDomain(getByTestId, user);
    fillRequiredFields(getByTestId);

    const submitButton = getByTestId(SUBMIT_BTN_TEST_ID);
    expect(submitButton).toBeInTheDocument();

    await waitFor(
      () => {
        expect(submitButton).toHaveAttribute('is-disabled', 'false');
      },
      { timeout: 10_000 },
    );

    // WHEN
    act(() => {
      user.click(submitButton);
    });

    // THEN
    // assert we have navigated to the newly created secret page
    await waitFor(
      () =>
        // TODO: update when detail page is done
        assertTextVisibility('Secret Detail'),
      { timeout: 10_000 },
    );
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

    selectDomain(getByTestId, user);
    fillRequiredFields(getByTestId);

    const submitButton = getByTestId(SUBMIT_BTN_TEST_ID);
    expect(submitButton).toBeInTheDocument();

    await waitFor(
      () => {
        expect(submitButton).toHaveAttribute('is-disabled', 'false');
      },
      { timeout: 10_000 },
    );
    // WHEN
    act(() => {
      user.click(submitButton);
    });

    // THEN
    // assert we display an error notification
    await waitFor(
      () => {
        assertTextVisibility('error_message');
      },
      { timeout: 10_000 },
    );
  });

  it('should return to the root page on back button click ', async () => {
    // GIVEN
    const user = userEvent.setup();
    const { container } = await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.secretCreate,
      {
        nbOkms: 0,
      },
    );
    await assertTextVisibility(labels.secretManager.create.title);

    // WHEN
    clickBackLink(container, user);

    // THEN
    await waitFor(
      () => {
        assertTextVisibility(labels.secretManager.common.secret_manager);
        assertTextVisibility(labels.secretManager.onboarding.description_1);
      },
      { timeout: 10_000 },
    );
  });

  describe('When there is a domainId search param', () => {
    it('should return to the domain secret list page on back button click', async () => {
      // GIVEN
      const mockDomainId = okmsMock[0].id;
      const user = userEvent.setup();
      const { container } = await renderTestApp(
        `${SECRET_MANAGER_ROUTES_URLS.secretCreate}?domainId=${mockDomainId}`,
      );
      await assertTextVisibility(labels.secretManager.create.title);

      // WHEN
      clickBackLink(container, user);

      // THEN
      await waitFor(
        () => {
          assertTextVisibility(labels.secretManager.common.secret_manager);
          assertTextVisibility(labels.secretManager.common.path);
          assertTextVisibility(labels.secretManager.common.version);
        },
        { timeout: 10_000 },
      );
    });
  });
});
