import React, { useState } from 'react';
import { i18n } from 'i18next';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { I18nextProvider } from 'react-i18next';
import { SECRET_MANAGER_SEARCH_PARAMS } from '@secret-manager/routes/routes.constants';
import { useSearchParams } from 'react-router-dom';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import userEvent, { UserEvent } from '@testing-library/user-event';
import {
  ServiceDetails,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import { vi } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { waitFor } from '@testing-library/dom';
import { act, render, screen } from '@testing-library/react';
import { SECRET_ACTIVATE_OKMS_TEST_IDS } from '@secret-manager/pages/createSecret/ActivateRegion.contants';
import { labels, initTestI18n } from '@/utils/tests/init.i18n';
import { OkmsManagement } from './OkmsManagement.component';
import { catalogMock } from '@/mocks/catalog/catalog.mock';
import {
  okmsMock,
  regionWithOneOkms,
  regionWithMultipleOkms,
  regionWithoutOkms,
} from '@/mocks/kms/okms.mock';
import { useOkmsList } from '@/data/hooks/useOkms';
import { OKMS } from '@/types/okms.type';
import { getOrderCatalogOKMS } from '@/data/api/orderCatalogOKMS';
import { ErrorResponse } from '@/types/api.type';
import { OrderOkmsModalProvider } from '@/common/pages/OrderOkmsModal/OrderOkmsModalContext';

let i18nValue: i18n;

vi.mock('@/data/api/orderCatalogOKMS', () => ({
  getOrderCatalogOKMS: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => vi.fn(),
    useHref: vi.fn((link) => link),
    useSearchParams: vi.fn(),
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const module: typeof import('@ovh-ux/manager-react-components') = await importOriginal();
  return {
    ...module,
    useServiceDetails: vi.fn(),
  };
});

vi.mocked(useServiceDetails).mockReturnValue({
  data: { data: { resource: { state: 'mockedState' } } },
} as UseQueryResult<ApiResponse<ServiceDetails>, ApiError>);

const mockedSetSearchParams = vi.fn();
vi.mocked(useSearchParams).mockReturnValue([
  new URLSearchParams(),
  mockedSetSearchParams,
]);

const shellContext = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'mocked_ovhSubsidiary' }),
  },
};

vi.mock('@/data/hooks/useOkms', () => ({
  useOkmsList: vi.fn(),
}));

vi.mocked(useOkmsList).mockReturnValue({
  data: okmsMock,
} as UseQueryResult<OKMS[], ErrorResponse>);

const setselectedOkmsIdMocked = vi.fn();

const TestComponent = () => {
  const [selectedOkmsId, setselectedOkmsId] = useState<string | undefined>();

  return (
    <OkmsManagement
      selectedOkmsId={selectedOkmsId}
      setSelectedOkmsId={(id) => {
        setselectedOkmsIdMocked(id);
        setselectedOkmsId(id);
      }}
    />
  );
};

const renderOkmsManagement = async (processingRegion?: string) => {
  const queryClient = new QueryClient();
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  return render(
    <I18nextProvider i18n={i18nValue}>
      <QueryClientProvider client={queryClient}>
        <ShellContext.Provider
          value={(shellContext as unknown) as ShellContextType}
        >
          <OrderOkmsModalProvider region={processingRegion}>
            <TestComponent />
          </OrderOkmsModalProvider>
        </ShellContext.Provider>
      </QueryClientProvider>
    </I18nextProvider>,
  );
};

/* TEST UTILS */
const assertInitialRegionList = async () => {
  const availableRegions = catalogMock.plans[0].configurations[0].values;
  await waitFor(
    () => {
      // assert that we display the correct region list
      // assert that none of the region radioCards are selected
      availableRegions.forEach((region) => {
        const regionRadioCard = screen.getByTestId(region);
        expect(regionRadioCard).not.toBeChecked();
      });

      // assert that no okms radioCard are displayed
      okmsMock.forEach((okms) => {
        expect(screen.queryByTestId(okms.id)).toBeNull();
      });
    },
    { timeout: 10_000 },
  );
};

const assertOkmsListIsNotInTheDocument = async (okmsList: OKMS[]) => {
  await waitFor(() => {
    okmsList.forEach(async (okms) => {
      const okmsRadioCard = screen.queryByTestId(okms.id);
      expect(okmsRadioCard).toBeNull();
    });
  });
};

const assertOkmsListIsInTheDocument = async (okmsList: OKMS[]) => {
  await waitFor(() => {
    okmsList.forEach((okms) => {
      assertTextVisibility(okms.iam.displayName);
      const okmsRadioCard = screen.getByTestId(okms.id);
      expect(okmsRadioCard).toBeVisible();
    });
  });
};

const assertActivateButtonIsInTheDocument = async () => {
  const activateButton = screen.queryByTestId(
    SECRET_ACTIVATE_OKMS_TEST_IDS.BUTTON,
  );
  await waitFor(() => {
    expect(activateButton).toBeVisible();
  });
};

const assertActivateButtonIsNotInTheDocument = async () => {
  const activateButton = screen.queryByTestId(
    SECRET_ACTIVATE_OKMS_TEST_IDS.BUTTON,
  );
  await waitFor(() => {
    expect(activateButton).toBeNull();
  });
};

const assertLoadingListIsInTheDocument = async () => {
  const activateSpinner = screen.queryByTestId(
    SECRET_ACTIVATE_OKMS_TEST_IDS.SPINNER,
  );
  await waitFor(() => {
    expect(activateSpinner).toBeVisible();
  });
};

const assertLoadingListIsNotInTheDocument = async () => {
  const activateSpinner = screen.queryByTestId(
    SECRET_ACTIVATE_OKMS_TEST_IDS.SPINNER,
  );
  await waitFor(() => {
    expect(activateSpinner).toBeNull();
  });
};

const selectRegion = async (user: UserEvent, region: string) => {
  const regionCard = screen.getByTestId(region);

  await act(() => user.click(regionCard));

  await waitFor(() => {
    expect(regionCard).toBeChecked();
  });
};

/* OKMS MANAGEMENT TEST SUITE */
describe('OKMS management test suite', () => {
  it('should display a spinner when loading', async () => {
    // GIVEN
    vi.mocked(getOrderCatalogOKMS).mockResolvedValueOnce(catalogMock);
    // WHEN
    await renderOkmsManagement();

    // THEN
    const regionsSpinner = screen.getByTestId('regionsSpinner');
    expect(regionsSpinner).toBeVisible();
  });

  it('should display a notification message when error on catalog api', async () => {
    // GIVEN
    const mockError: ErrorResponse = {
      response: { data: { message: 'errorCatalog' }, status: 500 },
    };
    vi.mocked(getOrderCatalogOKMS).mockRejectedValue(mockError);

    // WHEN
    await renderOkmsManagement();

    // THEN
    await assertTextVisibility(
      labels.common.error.error_message.replace(
        '{{message}}',
        mockError.response.data.message,
      ),
    );
  });

  it('should display the available region list', async () => {
    // GIVEN
    vi.mocked(getOrderCatalogOKMS).mockResolvedValueOnce(catalogMock);
    // WHEN
    await renderOkmsManagement();
    await assertTextVisibility(
      labels.secretManager.create_secret_form_region_section_title,
    );

    // THEN
    await assertInitialRegionList();
  });

  describe('on region selection', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });
    describe('when there is no okms', () => {
      it('should display a CTA', async () => {
        const user = userEvent.setup();
        // GIVEN
        vi.mocked(getOrderCatalogOKMS).mockResolvedValueOnce(catalogMock);

        await renderOkmsManagement();
        await assertTextVisibility(
          labels.secretManager.create_secret_form_region_section_title,
        );
        await assertTextVisibility(regionWithoutOkms.region);

        // WHEN
        await selectRegion(user, regionWithoutOkms.region);

        // THEN
        await assertOkmsListIsNotInTheDocument(okmsMock);
        await assertActivateButtonIsInTheDocument();
        await assertLoadingListIsNotInTheDocument();
        // assert we reset the selectedOkmsId
        expect(setselectedOkmsIdMocked).toHaveBeenCalledWith(undefined);
      });

      it('should display a loading state when an order is processing', async () => {
        const user = userEvent.setup();
        // GIVEN
        vi.mocked(getOrderCatalogOKMS).mockResolvedValueOnce(catalogMock);

        await renderOkmsManagement('rbx');
        await assertTextVisibility(
          labels.secretManager.create_secret_form_region_section_title,
        );
        await assertTextVisibility(regionWithoutOkms.region);

        // WHEN
        await selectRegion(user, regionWithoutOkms.region);

        // THEN
        await assertOkmsListIsNotInTheDocument(okmsMock);
        await assertActivateButtonIsNotInTheDocument();
        await assertLoadingListIsInTheDocument();
      });
    });

    it('should not display anything when there is exactly one okms', async () => {
      const user = userEvent.setup();
      // GIVEN
      vi.mocked(getOrderCatalogOKMS).mockResolvedValueOnce(catalogMock);

      await renderOkmsManagement();
      await assertTextVisibility(
        labels.secretManager.create_secret_form_region_section_title,
      );
      await assertTextVisibility(regionWithOneOkms.region);

      // WHEN
      await selectRegion(user, regionWithOneOkms.region);

      // THEN
      await assertOkmsListIsNotInTheDocument(okmsMock);
      await assertActivateButtonIsNotInTheDocument();
      // assert we select the region's
      expect(setselectedOkmsIdMocked).toHaveBeenCalledWith(
        regionWithOneOkms.okmsMock[0].id,
      );
    });

    it('should display a filtered okms list when there is more than one okms', async () => {
      const user = userEvent.setup();

      // GIVEN
      vi.mocked(getOrderCatalogOKMS).mockResolvedValueOnce(catalogMock);

      await renderOkmsManagement();
      await assertTextVisibility(
        labels.secretManager.create_secret_form_region_section_title,
      );
      await assertTextVisibility(regionWithMultipleOkms.region);

      // WHEN
      await selectRegion(user, regionWithMultipleOkms.region);

      // THEN
      await assertOkmsListIsNotInTheDocument(regionWithOneOkms.okmsMock);
      await assertOkmsListIsInTheDocument(regionWithMultipleOkms.okmsMock);
      await assertActivateButtonIsNotInTheDocument();
      // assert that the first okms is selected
      await waitFor(() => {
        const okmsRadioCard = screen.getByTestId(
          regionWithMultipleOkms.okmsMock[0].id,
        );
        expect(okmsRadioCard).toBeChecked();
      });
      // assert we set the selected okms id
      expect(setselectedOkmsIdMocked).toHaveBeenCalledWith(
        regionWithMultipleOkms.okmsMock[0].id,
      );
    });
  });

  describe('When there is a okmsId search param', () => {
    beforeEach(() => {
      vi.mocked(getOrderCatalogOKMS).mockResolvedValueOnce(catalogMock);
    });
    it('should pre-select the right region and okms', async () => {
      // GIVEN
      const mockOkmsId = okmsMock[0].id;
      const urlParams = new URLSearchParams();
      urlParams.set(SECRET_MANAGER_SEARCH_PARAMS.okmsId, mockOkmsId);
      vi.mocked(useSearchParams).mockReturnValueOnce([
        urlParams,
        mockedSetSearchParams,
      ]);

      // WHEN
      await renderOkmsManagement();
      await assertTextVisibility(
        labels.secretManager.create_secret_form_region_section_title,
      );

      // THEN
      const currentOkms = okmsMock.find((okms) => okms.id === mockOkmsId);
      const currentRegion = currentOkms.region;

      await assertTextVisibility(currentOkms.iam.displayName);

      await waitFor(
        () => {
          // assert the correct region RadioCard and okms RadioCard are checked
          const regionRadioCard = screen.getByTestId(currentRegion);
          expect(regionRadioCard).toBeChecked();
          const okmsRadioCard = screen.getByTestId(currentOkms.id);
          expect(okmsRadioCard).toBeChecked();
        },
        { timeout: 10_000 },
      );
    });

    it('should ignore okmsId if it does not exist', async () => {
      // GIVEN
      const mockOkmsId = '123456';
      const urlParams = new URLSearchParams();
      urlParams.set(SECRET_MANAGER_SEARCH_PARAMS.okmsId, mockOkmsId);
      vi.mocked(useSearchParams).mockReturnValueOnce([
        urlParams,
        mockedSetSearchParams,
      ]);

      // WHEN
      await renderOkmsManagement();
      await assertTextVisibility(
        labels.secretManager.create_secret_form_region_section_title,
      );

      // THEN
      await assertInitialRegionList();
      // assert reset search param
      expect(mockedSetSearchParams).toHaveBeenCalledWith({});
    });
  });
});
