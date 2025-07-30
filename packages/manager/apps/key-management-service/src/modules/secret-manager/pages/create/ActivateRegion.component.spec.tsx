import React from 'react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { render, screen } from '@testing-library/react';
import {
  ACTIVATE_DOMAIN_BTN_TEST_ID,
  ACTIVATE_DOMAIN_SPINNER_TEST_ID,
} from '@secret-manager/utils/tests/secret.constants';
import { labels, initTestI18n } from '@/utils/tests/init.i18n';
import { REGION_EU_WEST_RBX } from '@/mocks/catalog/catalog.mock';
import {
  ActivateRegion,
  ActivateRegionParams,
} from './ActivateRegion.component';

let i18nValue: i18n;

const navigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => navigate,
  };
});

const renderActivateRegion = async ({
  isUpdatingOkmsList,
  selectedRegion,
}: ActivateRegionParams) => {
  const queryClient = new QueryClient();
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  return render(
    <I18nextProvider i18n={i18nValue}>
      <QueryClientProvider client={queryClient}>
        <ActivateRegion
          isUpdatingOkmsList={isUpdatingOkmsList}
          selectedRegion={selectedRegion}
        />
      </QueryClientProvider>
    </I18nextProvider>,
  );
};

describe('ActivateRegion test suite', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('when okms list is not updating', () => {
    it('should render a button to navigate to okms silent creation modal', async () => {
      const user = userEvent.setup();
      // GIVEN
      const selectedRegionMock = REGION_EU_WEST_RBX;
      const updating = false;

      // WHEN
      await renderActivateRegion({
        isUpdatingOkmsList: updating,
        selectedRegion: selectedRegionMock,
      });

      // THEN
      const activateButton = screen.queryByTestId(ACTIVATE_DOMAIN_BTN_TEST_ID);
      expect(activateButton).toBeVisible();

      await user.click(activateButton);

      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith(
        SECRET_MANAGER_ROUTES_URLS.secretCreateOrderOkms(selectedRegionMock),
      );
    });
  });

  describe('when okms list is updating', () => {
    it('should render a loading state', async () => {
      // GIVEN
      const selectedRegionMock = REGION_EU_WEST_RBX;
      const updating = true;

      // WHEN
      await renderActivateRegion({
        isUpdatingOkmsList: updating,
        selectedRegion: selectedRegionMock,
      });

      // THEN
      const Spinner = screen.queryByTestId(ACTIVATE_DOMAIN_SPINNER_TEST_ID);
      expect(Spinner).toBeVisible();

      await assertTextVisibility(
        labels.secretManager.create.domain_activation_in_progress,
      );
    });
  });
});
