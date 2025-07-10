import React, { useState } from 'react';
import { i18n } from 'i18next';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { I18nextProvider } from 'react-i18next';
import { filterDomainsByRegion } from '@secret-manager/utils/domains';
import { SECRET_MANAGER_SEARCH_PARAMS } from '@secret-manager/routes/routes.constants';
import { useSearchParams } from 'react-router-dom';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import userEvent, { UserEvent } from '@testing-library/user-event';
import {
  ServiceDetails,
  UseResourcesIcebergV2Result,
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
import { labels, initTestI18n } from '@/utils/tests/init.i18n';
import { DomainManagement } from './DomainManagement.component';
import { catalogMock } from '@/mocks/catalog/catalog.mock';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { useOkmsList } from '@/data/hooks/useOkms';
import { OKMS } from '@/types/okms.type';
import { getOrderCatalogOKMS } from '@/data/api/orderCatalogOKMS';

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
  data: { pages: [{ data: okmsMock }] },
} as UseResourcesIcebergV2Result<OKMS>);

const TestComponent = () => {
  const [selectedDomainId, setSelectedDomainId] = useState<
    string | undefined
  >();

  return (
    <DomainManagement
      selectedDomainId={selectedDomainId}
      setSelectedDomainId={setSelectedDomainId}
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
const firstRegion = catalogMock.plans[0].configurations[0].values[0];

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

const selectRegion = async (user: UserEvent) => {
  const firstRegionRadioCard = screen.getByTestId(firstRegion);

  await act(() => user.click(firstRegionRadioCard));
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

  it('should display a filtered domain list and select the first one on a region selection', async () => {
    const user = userEvent.setup();
    // GIVEN
    vi.mocked(getOrderCatalogOKMS).mockResolvedValueOnce(catalogMock);

    const regionDomainList = filterDomainsByRegion({
      domains: okmsMock,
      region: firstRegion,
    });
    await renderDomainManagement();
    await assertTextVisibility(
      labels.secretManager.create.domain_section_title,
    );
    await assertTextVisibility(firstRegion);

    // WHEN
    await selectRegion(user);

    // THEN
    await waitFor(() => {
      // assert we display the correct domain list
      // assert that the first domain is selected
      regionDomainList.forEach((domain, index) => {
        assertTextVisibility(domain.iam.displayName);
        const domainRadioCard = screen.getByTestId(domain.id);
        if (index === 0) {
          expect(domainRadioCard).toBeChecked();
          return;
        }
        expect(domainRadioCard).not.toBeChecked();
      });
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
