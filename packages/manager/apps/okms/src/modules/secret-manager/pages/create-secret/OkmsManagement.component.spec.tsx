import { useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useOkmsList } from '@key-management-service/data/hooks/useOkms';
import { useNotificationAddErrorOnce } from '@key-management-service/hooks/useNotificationAddErrorOnce';
import {
  okmsMock,
  okmsRoubaix1Mock,
  okmsRoubaix2Mock,
  okmsRoubaix3MockExpired,
  regionWithMultipleOkms,
  regionWithOneOkms,
  regionWithoutOkms,
} from '@key-management-service/mocks/kms/okms.mock';
import { OKMS } from '@key-management-service/types/okms.type';
import { SECRET_ACTIVATE_OKMS_TEST_IDS } from '@secret-manager/pages/create-secret/ActivateRegion.constants';
import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import { waitFor } from '@testing-library/dom';
import { act, render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { ServiceDetails, useServiceDetails } from '@ovh-ux/manager-module-common-api';
import { ShellContext, ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { REGION_PICKER_TEST_IDS } from '@/common/components/region-picker/regionPicker.constants';
import * as locationApi from '@/common/data/api/location';
import { getOrderCatalogOkms } from '@/common/data/api/orderCatalogOkms';
import { useReferenceRegions } from '@/common/data/hooks/useReferenceRegions';
import {
  REGION_EU_WEST_GRA,
  REGION_EU_WEST_RBX,
  REGION_EU_WEST_SBG,
  catalogMock,
} from '@/common/mocks/catalog/catalog.mock';
import { locationsMock } from '@/common/mocks/locations/locations.mock';
import { referenceRegionsMock } from '@/common/mocks/reference-regions/referenceRegions.mock';
import { ErrorResponse } from '@/common/types/api.type';
import { initTestI18n, labels } from '@/common/utils/tests/init.i18n';
import { createErrorResponseMock } from '@/common/utils/tests/testUtils';
import { assertTextVisibility } from '@/common/utils/tests/uiTestHelpers';
import { invariant } from '@/common/utils/tools/invariant';

import { OkmsManagement } from './OkmsManagement.component';

let i18nValue: i18n;

const mockedGetOrderCatalogOkms = vi.mocked(getOrderCatalogOkms);
vi.mock('@/common/data/api/orderCatalogOkms', () => ({
  getOrderCatalogOkms: vi.fn(),
}));

vi.spyOn(locationApi, 'getLocations').mockResolvedValue(locationsMock);

vi.mock('@key-management-service/hooks/useNotificationAddErrorOnce', () => ({
  useNotificationAddErrorOnce: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => vi.fn(),
    useSearchParams: vi.fn(),
  };
});

vi.mock('@/common/data/hooks/useReferenceRegions', () => ({
  useReferenceRegions: vi.fn(),
}));

vi.mocked(useReferenceRegions).mockReturnValue({
  data: referenceRegionsMock,
  isPending: false,
  error: null,
} as unknown as ReturnType<typeof useReferenceRegions>);

vi.mock('@ovh-ux/manager-module-common-api', async (importOriginal) => {
  const module: typeof import('@ovh-ux/manager-module-common-api') = await importOriginal();
  return {
    ...module,
    useServiceDetails: vi.fn(),
  };
});

const mockServiceDetails = {
  data: {
    resource: {
      state: 'active',
    },
  },
};
vi.mocked(useServiceDetails).mockReturnValue({
  data: mockServiceDetails,
} as UseQueryResult<ApiResponse<ServiceDetails>, ApiError>);

const mockedSetSearchParams = vi.fn();
vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), mockedSetSearchParams]);

const shellContext = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'mocked_ovhSubsidiary' }),
  },
};

vi.mock('@key-management-service/data/hooks/useOkms', () => ({
  useOkmsList: vi.fn(),
}));

vi.mocked(useOkmsList).mockReturnValue({
  data: okmsMock,
} as UseQueryResult<OKMS[], ErrorResponse>);

const setselectedOkmsIdMocked = vi.fn();

const TestComponent = ({ okmsId }: { okmsId?: string }) => {
  const [selectedOkmsId, setselectedOkmsId] = useState<string | undefined>(okmsId);

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

const renderOkmsManagement = async (okmsId?: string) => {
  const queryClient = new QueryClient();
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  return render(
    <I18nextProvider i18n={i18nValue}>
      <QueryClientProvider client={queryClient}>
        <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
          <TestComponent okmsId={okmsId} />
        </ShellContext.Provider>
      </QueryClientProvider>
    </I18nextProvider>,
  );
};

/* TEST UTILS */
const assertInitialRegionList = async () => {
  // Regions available in the catalog - Only Europe as other ones are in other tabs
  const availableRegions = [REGION_EU_WEST_RBX, REGION_EU_WEST_SBG, REGION_EU_WEST_GRA];

  if (!availableRegions) {
    throw new Error('Available regions not found');
  }

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
    okmsList.forEach((okms) => {
      const okmsRadioCard = screen.queryByTestId(okms.id);
      expect(okmsRadioCard).toBeNull();
    });
  });
};

const assertOkmsListIsInTheDocument = async (okmsList: OKMS[]) => {
  await waitFor(() => {
    okmsList.forEach(async (okms) => {
      await assertTextVisibility(okms.iam.displayName);
      const okmsRadioCard = screen.getByTestId(okms.id);
      expect(okmsRadioCard).toBeVisible();
    });
  });
};

const assertActivateButtonIsInTheDocument = async () => {
  const activateButton = screen.queryByTestId(SECRET_ACTIVATE_OKMS_TEST_IDS.BUTTON);
  await waitFor(() => {
    expect(activateButton).toBeVisible();
  });
};

const assertActivateButtonIsNotInTheDocument = async () => {
  const activateButton = screen.queryByTestId(SECRET_ACTIVATE_OKMS_TEST_IDS.BUTTON);
  await waitFor(() => {
    expect(activateButton).toBeNull();
  });
};

const assertLoadingListIsNotInTheDocument = async () => {
  const activateSpinner = screen.queryByTestId(SECRET_ACTIVATE_OKMS_TEST_IDS.SPINNER);
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
  beforeEach(() => {
    // Set default successful mock behavior for all tests
    mockedGetOrderCatalogOkms.mockResolvedValue(catalogMock);
  });

  afterEach(() => {
    // Clean up all mocks after each test to prevent pollution
    vi.clearAllMocks();
  });

  it('should display a spinner when loading', async () => {
    // WHEN
    await renderOkmsManagement();

    // THEN
    const regionsSpinner = screen.getByTestId(REGION_PICKER_TEST_IDS.SPINNER);
    expect(regionsSpinner).toBeVisible();
  });

  it('should display a notification message when error on catalog api', async () => {
    // GIVEN - override default mock for this specific test
    const mockError = createErrorResponseMock('errorCatalog');
    mockedGetOrderCatalogOkms.mockRejectedValue(mockError);

    // WHEN
    await renderOkmsManagement();

    // THEN
    await waitFor(() => {
      expect(useNotificationAddErrorOnce).toHaveBeenCalledWith(mockError);
    });
  });

  it('should display the available region list', async () => {
    // WHEN
    await renderOkmsManagement();
    await assertTextVisibility(labels.secretManager.create_secret_form_region_section_title);

    // THEN
    await assertInitialRegionList();
  });

  describe('on region selection', () => {
    describe('when there is no okms', () => {
      it('should display a CTA', async () => {
        const user = userEvent.setup();

        await renderOkmsManagement();
        await assertTextVisibility(labels.secretManager.create_secret_form_region_section_title);
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
    });

    it('should not display anything when there is exactly one okms', async () => {
      const user = userEvent.setup();

      await renderOkmsManagement();
      await assertTextVisibility(labels.secretManager.create_secret_form_region_section_title);
      await assertTextVisibility(regionWithOneOkms.region);

      // WHEN
      await selectRegion(user, regionWithOneOkms.region);

      // THEN
      await assertOkmsListIsNotInTheDocument(okmsMock);
      await assertActivateButtonIsNotInTheDocument();
      // assert we select the region's
      expect(setselectedOkmsIdMocked).toHaveBeenCalledWith(regionWithOneOkms.okmsMock?.[0]?.id);
    });

    it('should display a filtered okms list when there is more than one okms', async () => {
      const user = userEvent.setup();

      await renderOkmsManagement();
      await assertTextVisibility(labels.secretManager.create_secret_form_region_section_title);
      await assertTextVisibility(regionWithMultipleOkms.region);

      // WHEN
      await selectRegion(user, regionWithMultipleOkms.region);

      // THEN
      await assertOkmsListIsNotInTheDocument(regionWithOneOkms.okmsMock);
      await assertOkmsListIsInTheDocument(regionWithMultipleOkms.okmsMock);
      await assertActivateButtonIsNotInTheDocument();

      const firstOkmsId = regionWithMultipleOkms.okmsMock?.[0]?.id;
      invariant(firstOkmsId, 'First okms id not found');

      // assert that the first okms is selected
      await waitFor(() => {
        const okmsRadioCard = screen.getByTestId(firstOkmsId);
        expect(okmsRadioCard).toBeChecked();
      });
      // assert we set the selected okms id
      expect(setselectedOkmsIdMocked).toHaveBeenCalledWith(firstOkmsId);
    });

    it('should filter expired okms out of the list', async () => {
      const user = userEvent.setup();

      // GIVEN
      const mockOkmsList = [okmsRoubaix1Mock, okmsRoubaix2Mock, okmsRoubaix3MockExpired];
      vi.mocked(useOkmsList).mockReturnValue({
        data: mockOkmsList,
      } as UseQueryResult<OKMS[], ErrorResponse>);

      await renderOkmsManagement();
      await assertTextVisibility(labels.secretManager.create_secret_form_region_section_title);
      await assertTextVisibility(regionWithMultipleOkms.region);

      // WHEN
      await selectRegion(user, regionWithMultipleOkms.region);

      // THEN
      await assertOkmsListIsNotInTheDocument([okmsRoubaix3MockExpired]);
      await assertOkmsListIsInTheDocument([okmsRoubaix1Mock, okmsRoubaix2Mock]);
      await assertActivateButtonIsNotInTheDocument();
    });
  });

  describe('When there is an okmsId search param', () => {
    it('should pre-select the right region and okms', async () => {
      // GIVEN
      const mockOkmsId = okmsRoubaix1Mock.id;

      // WHEN
      await renderOkmsManagement(mockOkmsId);
      await assertTextVisibility(labels.secretManager.create_secret_form_region_section_title);

      // THEN
      const currentOkms = okmsMock.find((okms) => okms.id === mockOkmsId);
      invariant(currentOkms, 'Current okms not found');
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

      // WHEN
      await renderOkmsManagement(mockOkmsId);
      await assertTextVisibility(labels.secretManager.create_secret_form_region_section_title);

      // THEN
      await assertInitialRegionList();
      // assert reset search param
      expect(mockedSetSearchParams).toHaveBeenCalledWith({});
    });
  });
});
