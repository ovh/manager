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
import { ACTIVATE_DOMAIN_BTN_TEST_ID } from '@secret-manager/utils/tests/secret.constants';
import { labels, initTestI18n } from '@/utils/tests/init.i18n';
import { DomainManagement } from './DomainManagement.component';
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

let i18nValue: i18n;

vi.mock('@/data/api/orderCatalogOKMS', () => ({
  getOrderCatalogOKMS: vi.fn(),
}));

const location = {
  state: '',
};

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => vi.fn(),
    useHref: vi.fn((link) => link),
    useSearchParams: vi.fn(),
    useLocation: () => location,
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

const setSelectedDomainIdMocked = vi.fn();

const TestComponent = () => {
  const [selectedDomainId, setSelectedDomainId] = useState<
    string | undefined
  >();

  return (
    <DomainManagement
      selectedDomainId={selectedDomainId}
      setSelectedDomainId={(id) => {
        setSelectedDomainIdMocked(id);
        setSelectedDomainId(id);
      }}
    />
  );
};

const renderDomainManagement = async () => {
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
          <TestComponent />
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

      // assert that no domain radioCard are displayed
      okmsMock.forEach((domain) => {
        expect(screen.queryByTestId(domain.id)).toBeNull();
      });
    },
    { timeout: 10_000 },
  );
};

const assertDomainsAreNotInTheDocument = async (domains: OKMS[]) => {
  await waitFor(() => {
    domains.forEach(async (domain) => {
      const domainRadioCard = screen.queryByTestId(domain.id);
      expect(domainRadioCard).toBeNull();
    });
  });
};

const assertDomainsAreInTheDocument = async (domains: OKMS[]) => {
  await waitFor(() => {
    domains.forEach((domain) => {
      assertTextVisibility(domain.iam.displayName);
      const domainRadioCard = screen.getByTestId(domain.id);
      expect(domainRadioCard).toBeVisible();
    });
  });
};

const assertActivateButtonIsInTheDocument = async () => {
  const activateButton = screen.queryByTestId(ACTIVATE_DOMAIN_BTN_TEST_ID);
  await waitFor(() => {
    expect(activateButton).toBeVisible();
  });
};

const assertActivateButtonIsNotInTheDocument = async () => {
  const activateButton = screen.queryByTestId(ACTIVATE_DOMAIN_BTN_TEST_ID);
  await waitFor(() => {
    expect(activateButton).toBeNull();
  });
};

const selectRegion = async (user: UserEvent, region: string) => {
  const regionCard = screen.getByTestId(region);

  await act(() => user.click(regionCard));

  await waitFor(() => {
    expect(regionCard).toBeChecked();
  });
};

/* DOMAIN MANAGEMENT TEST SUITE */
describe('Domain management test suite', () => {
  it('should display a spinner when loading', async () => {
    // GIVEN
    vi.mocked(getOrderCatalogOKMS).mockResolvedValueOnce(catalogMock);
    // WHEN
    await renderDomainManagement();

    // THEN
    const regionsSpinner = screen.getByTestId('regionsSpinner');
    expect(regionsSpinner).toBeVisible();
  });

  it('should display a notification message when error on catalog api', async () => {
    // GIVEN
    vi.mocked(getOrderCatalogOKMS).mockRejectedValueOnce(
      new Error('Mocked error'),
    );
    // WHEN
    await renderDomainManagement();

    // THEN
    await assertTextVisibility('error_message');
  });

  it('should display the available region list', async () => {
    // GIVEN
    vi.mocked(getOrderCatalogOKMS).mockResolvedValueOnce(catalogMock);
    // WHEN
    await renderDomainManagement();
    await assertTextVisibility(
      labels.secretManager.create.domain_section_title,
    );

    // THEN
    await assertInitialRegionList();
  });

  describe('on region selection', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });
    it('should display a CTA when there is no domain', async () => {
      const user = userEvent.setup();
      // GIVEN
      vi.mocked(getOrderCatalogOKMS).mockResolvedValueOnce(catalogMock);

      await renderDomainManagement();
      await assertTextVisibility(
        labels.secretManager.create.domain_section_title,
      );
      await assertTextVisibility(regionWithoutOkms.region);

      // WHEN
      await selectRegion(user, regionWithoutOkms.region);

      // THEN
      await assertDomainsAreNotInTheDocument(okmsMock);
      await assertActivateButtonIsInTheDocument();
      // assert we reset the selectedDomainId
      expect(setSelectedDomainIdMocked).toHaveBeenCalledWith(undefined);
    });

    it('should not display anything when there is exactly one domain', async () => {
      const user = userEvent.setup();
      // GIVEN
      vi.mocked(getOrderCatalogOKMS).mockResolvedValueOnce(catalogMock);

      await renderDomainManagement();
      await assertTextVisibility(
        labels.secretManager.create.domain_section_title,
      );
      await assertTextVisibility(regionWithOneOkms.region);

      // WHEN
      await selectRegion(user, regionWithOneOkms.region);

      // THEN
      await assertDomainsAreNotInTheDocument(okmsMock);
      await assertActivateButtonIsNotInTheDocument();
      // assert we select the region's domain
      expect(setSelectedDomainIdMocked).toHaveBeenCalledWith(
        regionWithOneOkms.okmsMock[0].id,
      );
    });

    it('should display a filtered domain list when there is more than one domain', async () => {
      const user = userEvent.setup();

      // GIVEN
      vi.mocked(getOrderCatalogOKMS).mockResolvedValueOnce(catalogMock);

      await renderDomainManagement();
      await assertTextVisibility(
        labels.secretManager.create.domain_section_title,
      );
      await assertTextVisibility(regionWithMultipleOkms.region);

      // WHEN
      await selectRegion(user, regionWithMultipleOkms.region);

      // THEN
      await assertDomainsAreNotInTheDocument(regionWithOneOkms.okmsMock);
      await assertDomainsAreInTheDocument(regionWithMultipleOkms.okmsMock);
      await assertActivateButtonIsNotInTheDocument();
      // assert that the first domain is selected
      await waitFor(() => {
        const domainRadioCard = screen.getByTestId(
          regionWithMultipleOkms.okmsMock[0].id,
        );
        expect(domainRadioCard).toBeChecked();
      });
      // assert we set the selected domain id
      expect(setSelectedDomainIdMocked).toHaveBeenCalledWith(
        regionWithMultipleOkms.okmsMock[0].id,
      );
    });
  });

  describe('When there is a domainId search param', () => {
    beforeEach(() => {
      vi.mocked(getOrderCatalogOKMS).mockResolvedValueOnce(catalogMock);
    });
    it('should pre-select the right region and domain', async () => {
      // GIVEN
      const mockDomainId = okmsMock[0].id;
      const urlParams = new URLSearchParams();
      urlParams.set(SECRET_MANAGER_SEARCH_PARAMS.domainId, mockDomainId);
      vi.mocked(useSearchParams).mockReturnValueOnce([
        urlParams,
        mockedSetSearchParams,
      ]);

      // WHEN
      await renderDomainManagement();
      await assertTextVisibility(
        labels.secretManager.create.domain_section_title,
      );

      // THEN
      const currentDomain = okmsMock.find(
        (domain) => domain.id === mockDomainId,
      );
      const currentRegion = currentDomain.region;

      await assertTextVisibility(currentDomain.iam.displayName);

      await waitFor(
        () => {
          // assert the correct region RadioCard and Domain RadioCard are checked
          const regionRadioCard = screen.getByTestId(currentRegion);
          expect(regionRadioCard).toBeChecked();
          const domainRadioCard = screen.getByTestId(currentDomain.id);
          expect(domainRadioCard).toBeChecked();
        },
        { timeout: 10_000 },
      );
    });

    it('should ignore domainId if it does not exist', async () => {
      // GIVEN
      const mockDomainId = '123456';
      const urlParams = new URLSearchParams();
      urlParams.set(SECRET_MANAGER_SEARCH_PARAMS.domainId, mockDomainId);
      vi.mocked(useSearchParams).mockReturnValueOnce([
        urlParams,
        mockedSetSearchParams,
      ]);

      // WHEN
      await renderDomainManagement();
      await assertTextVisibility(
        labels.secretManager.create.domain_section_title,
      );

      // THEN
      await assertInitialRegionList();
      // assert reset search param
      expect(mockedSetSearchParams).toHaveBeenCalledWith({});
    });
  });
});
