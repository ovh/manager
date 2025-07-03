import {
  assertTextVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { Matcher, MatcherOptions, waitFor } from '@testing-library/dom';
import { fireEvent, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
) => {
  const user = userEvent.setup();
  const firstRegion = catalogMock.plans[0].configurations[0].values[0];

  await assertTextVisibility(firstRegion);

  const firstRegionRadioCard = getByTestId(firstRegion);
  const regionDomainList = okmsMock.filter(
    (domain) => domain.region === firstRegion,
  );
  user.click(firstRegionRadioCard);

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

/* CREATE PAGE TEST SUITE */
describe('Create secret page test suite', () => {
  it('should display the form sections', async () => {
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.secretCreate);

    await assertTextVisibility(labels.secretManager.create.title);
    await assertTextVisibility(
      labels.secretManager.create.region_section_title,
    );
    await assertTextVisibility(
      labels.secretManager.create.values_section_title,
    );
    await assertTextVisibility(
      labels.secretManager.create.paiement_section_title,
    );
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

    await assertInitialRegionAndDomainList(getByTestId, queryByTestId);
  });

  it('should display a filtered domain list and select the first one on a region selection', async () => {
    // GIVEN
    // WHEN
    const { getByTestId } = await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.secretCreate,
    );
    await assertTextVisibility(labels.secretManager.create.title);

    // THEN
    selectDomain(getByTestId);
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
      await assertInitialRegionAndDomainList(getByTestId, queryByTestId);
    });
  });
});

type TestCase = {
  path: string;
  data: string;
  selectedDomainId: boolean;
  shouldButtonBeDisabled: boolean;
};

const testCases: TestCase[] = [
  { data: '', path: '', selectedDomainId: false, shouldButtonBeDisabled: true },
  {
    data: '{"a": "json"}',
    path: '',
    selectedDomainId: false,
    shouldButtonBeDisabled: true,
  },
  {
    data: '',
    path: 'a/path',
    selectedDomainId: false,
    shouldButtonBeDisabled: true,
  },
  { data: '', path: '', selectedDomainId: true, shouldButtonBeDisabled: true },
  {
    data: '{"a": "json"}',
    path: 'a/path',
    selectedDomainId: false,
    shouldButtonBeDisabled: true,
  },
  {
    data: '{"a": "json"}',
    path: 'a/path',
    selectedDomainId: true,
    shouldButtonBeDisabled: false,
  },
];

describe('Secrets creation form test suite', () => {
  it.each(testCases)(
    'should check the form validity for data: $data, path: $path and a selectedDomain: $selectedDomainId ',
    async ({ data, path, selectedDomainId, shouldButtonBeDisabled }) => {
      // GIVEN
      const { getByTestId } = await renderTestApp(
        SECRET_MANAGER_ROUTES_URLS.secretCreate,
      );
      await assertTextVisibility(labels.secretManager.create.title);

      const inputPath = getByTestId('secret-path') as any;
      expect(inputPath).toBeInTheDocument();
      const inputValues = getByTestId('secret-data') as any;
      expect(inputValues).toBeInTheDocument();
      const submitButton = getByTestId('secret-submit');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('is-disabled', 'true');

      // WHEN
      await waitFor(() => {
        fireEvent.input(inputPath, {
          target: { value: path },
        });

        fireEvent.change(inputValues, {
          target: { value: data },
        });
      });

      if (selectedDomainId) selectDomain(getByTestId);

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

  // manage the domain selected as well, and the updated list also
  it('should navigate to the created secret page on submit', async () => {
    // GIVEN
    const user = userEvent.setup();
    const { getByTestId } = await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.secretCreate,
    );
    await assertTextVisibility(labels.secretManager.create.title);

    selectDomain(getByTestId);

    // fill mandatory inputs
    const inputPath = getByTestId('secret-path') as any;
    expect(inputPath).toBeInTheDocument();
    const inputValues = getByTestId('secret-data') as any;
    expect(inputValues).toBeInTheDocument();
    const submitButton = getByTestId('secret-submit');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('is-disabled', 'true');

    await waitFor(() => {
      fireEvent.input(inputPath, {
        target: { value: 'path' },
      });

      fireEvent.change(inputValues, {
        target: { value: '{"a": "json"}' },
      });
    });

    await waitFor(
      () => {
        expect(submitButton).toHaveAttribute('is-disabled', 'false');
      },
      { timeout: 10_000 },
    );

    // WHEN
    await user.click(submitButton);

    // THEN
    // assert we have navigated to the newly created secret page
    await waitFor(
      async () => {
        // TODO: update when detail page is done
        await assertTextVisibility('Secret Detail');
      },
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

    selectDomain(getByTestId);

    // fill mandatory inputs
    const inputPath = getByTestId('secret-path') as any;
    expect(inputPath).toBeInTheDocument();
    const inputValues = getByTestId('secret-data') as any;
    expect(inputValues).toBeInTheDocument();
    const submitButton = getByTestId('secret-submit');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('is-disabled', 'true');

    await waitFor(() => {
      fireEvent.input(inputPath, {
        target: { value: 'path' },
      });

      fireEvent.change(inputValues, {
        target: { value: '{"a": "json"}' },
      });
    });

    await waitFor(
      () => {
        expect(submitButton).toHaveAttribute('is-disabled', 'false');
      },
      { timeout: 10_000 },
    );

    // WHEN
    await waitFor(() => user.click(submitButton));

    // THEN
    // assert we display an error notification
    await waitFor(
      async () => {
        await assertTextVisibility('error_message');
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
    const backLink = await getOdsButtonByLabel({
      container,
      label: 'back',
      isLink: true,
    });
    user.click(backLink);

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
      const backLink = await getOdsButtonByLabel({
        container,
        label: 'back',
        isLink: true,
      });
      user.click(backLink);

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

type PathTestCase = {
  input: string;
  error: string;
};

const pathTestCases: PathTestCase[] = [
  { input: '', error: 'error_min_chars' },
  { input: '/', error: labels.secretManager.create.path_error_structure },
  { input: 'asd/', error: labels.secretManager.create.path_error_structure },
  { input: 'a//a', error: labels.secretManager.create.path_error_structure },
  {
    input: '!',
    error: labels.secretManager.create.path_error_allowed_characters,
  },
];

describe('Path input test suite', () => {
  it.each(pathTestCases)(
    'should display error $error when the input is $input',
    async ({ input, error }) => {
      // GIVEN
      const { getByTestId } = await renderTestApp(
        SECRET_MANAGER_ROUTES_URLS.secretCreate,
      );
      await assertTextVisibility(labels.secretManager.create.title);

      selectDomain(getByTestId);

      const inputPath = getByTestId('secret-path') as any;
      const formFieldPath = getByTestId('secret-path-formField') as any;
      expect(inputPath).toBeInTheDocument();
      expect(formFieldPath).toBeInTheDocument();
      await waitFor(() => {
        inputPath.odsBlur.emit({});
      });

      // WHEN
      await waitFor(() => {
        fireEvent.input(inputPath, {
          target: { value: input },
        });
      });

      // THEN
      await waitFor(
        () => {
          expect(formFieldPath).toHaveAttribute('error', error);
        },
        { timeout: 10_000 },
      );
    },
  );
});

type DataTestCase = {
  input: string;
  error: string;
};

const dataTestCases: DataTestCase[] = [
  { input: '', error: 'required_field' },
  {
    input: 'not-a-json',
    error: labels.secretManager.create.values_error_invalid_json,
  },
];

describe('Values input test suite', () => {
  it.each(dataTestCases)(
    'should display error $error when the input is $input',
    async ({ input, error }) => {
      // GIVEN
      const { getByTestId } = await renderTestApp(
        SECRET_MANAGER_ROUTES_URLS.secretCreate,
      );
      await assertTextVisibility(labels.secretManager.create.title);

      selectDomain(getByTestId);

      const inputData = getByTestId('secret-data') as any;
      const formFieldData = getByTestId('secret-data-formField') as any;
      expect(inputData).toBeInTheDocument();
      expect(formFieldData).toBeInTheDocument();
      await waitFor(() => {
        inputData.odsBlur.emit({});
      });

      // WHEN
      await waitFor(() => {
        fireEvent.input(inputData, {
          target: { value: input },
        });
      });

      // THEN
      await waitFor(
        () => {
          expect(formFieldData).toHaveAttribute('error', error);
        },
        { timeout: 10_000 },
      );
    },
  );
});
