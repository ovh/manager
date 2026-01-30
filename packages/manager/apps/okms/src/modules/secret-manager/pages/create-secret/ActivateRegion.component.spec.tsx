import { SECRET_ACTIVATE_OKMS_TEST_IDS } from '@secret-manager/pages/create-secret/ActivateRegion.constants';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { act, screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';

import { REGION_EU_WEST_RBX } from '@/common/mocks/catalog/catalog.mock';
import { registerPendingOrder } from '@/common/store/pendingOkmsOrder';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { ActivateRegion, ActivateRegionParams } from './ActivateRegion.component';

const navigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => navigate,
  };
});

const renderActivateRegion = async ({ selectedRegion }: ActivateRegionParams) => {
  const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();
  return render(<ActivateRegion selectedRegion={selectedRegion} />, { wrapper });
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

      // WHEN
      await renderActivateRegion({
        selectedRegion: selectedRegionMock,
      });

      // THEN
      const activateButton = screen.queryByTestId(SECRET_ACTIVATE_OKMS_TEST_IDS.BUTTON);
      expect(activateButton).toBeVisible();

      if (activateButton) {
        await act(async () => {
          await user.click(activateButton);
        });
      }

      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith(
        SECRET_MANAGER_ROUTES_URLS.createSecretOrderOkms(selectedRegionMock),
      );
    });
  });

  describe('when okms list is updating', () => {
    it('should render a loading state', async () => {
      // GIVEN
      const selectedRegionMock = REGION_EU_WEST_RBX;
      registerPendingOrder(selectedRegionMock);

      // WHEN
      await renderActivateRegion({
        selectedRegion: selectedRegionMock,
      });

      // THEN
      const Spinner = screen.queryByTestId(SECRET_ACTIVATE_OKMS_TEST_IDS.SPINNER);
      expect(Spinner).toBeVisible();

      await assertTextVisibility(/Veuillez patienter pendant l'activation du domaine OKMS/i);
    });
  });
});
