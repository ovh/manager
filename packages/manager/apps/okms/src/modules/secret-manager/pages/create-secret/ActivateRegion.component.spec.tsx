import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { screen } from '@testing-library/react';
import { SECRET_ACTIVATE_OKMS_TEST_IDS } from '@secret-manager/pages/create-secret/ActivateRegion.constants';
import { REGION_EU_WEST_RBX } from '@key-management-service/mocks/catalog/catalog.mock';
import {
  ActivateRegion,
  ActivateRegionParams,
} from './ActivateRegion.component';
import { registerPendingOrder } from '@/common/store/pendingOkmsOrder';
import { renderWithClient } from '@/common/utils/tests/testUtils';

const navigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => navigate,
  };
});

const renderActivateRegion = async ({
  selectedRegion,
}: ActivateRegionParams) => {
  return renderWithClient(<ActivateRegion selectedRegion={selectedRegion} />);
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
      const activateButton = screen.queryByTestId(
        SECRET_ACTIVATE_OKMS_TEST_IDS.BUTTON,
      );
      expect(activateButton).toBeVisible();

      await user.click(activateButton);

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
      const Spinner = screen.queryByTestId(
        SECRET_ACTIVATE_OKMS_TEST_IDS.SPINNER,
      );
      expect(Spinner).toBeVisible();

      await assertTextVisibility('okms_activation_in_progress');
    });
  });
});
