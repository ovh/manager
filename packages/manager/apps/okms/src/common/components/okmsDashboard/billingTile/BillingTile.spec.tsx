import { screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import userEvent from '@testing-library/user-event';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { BillingTile } from './BillingTile.component';
import { BILLING_TILE_TEST_IDS } from './BillingTile.constants';
import useProductType, { ProductType } from '@/common/hooks/useProductType';
import { KMS_ROUTES_URIS } from '@/routes/routes.constants';
import { renderWithI18n } from '@/utils/tests/testUtils';

const okmsMocked = okmsMock[0];

vi.mock('@/common/hooks/useProductType');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => mockNavigate,
    useMatches: vi.fn(),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const mod = await importOriginal<
    typeof import('@ovh-ux/manager-react-shell-client')
  >();

  return {
    ...mod,
    useOvhTracking: () => ({ trackClick: vi.fn() }),
  };
});

vi.mock('@ovh-ux/billing-informations', async (original) => ({
  ...(await original()),
  BillingInformationsTileStandard: vi.fn(
    ({ onResiliateLinkClick, resourceName }) => (
      <div
        data-testid={BILLING_TILE_TEST_IDS.billingInformationsTile}
        id={resourceName}
        onClick={onResiliateLinkClick}
      />
    ),
  ),
}));

describe('OKMS Billing Tile test suite', () => {
  type UseCases = {
    productType: ProductType;
    resiliateLink: string;
  };

  const useCases: UseCases[] = [
    {
      productType: 'key-management-service',
      resiliateLink: KMS_ROUTES_URIS.kmsTerminate,
    },
    {
      productType: 'secret-manager',
      resiliateLink: SECRET_MANAGER_ROUTES_URLS.okmsTerminateModal(
        okmsMocked.id,
      ),
    },
  ];

  it.each(useCases)(
    'should display tile content and have productType $productType resiliate link $resiliateLink ',
    async ({ productType, resiliateLink }) => {
      vi.mocked(useProductType).mockReturnValue(productType);
      const user = userEvent.setup();
      // GIVEN

      // WHEN
      await renderWithI18n(<BillingTile okms={okmsMocked} />);

      // THEN
      const mockedBillingTile = screen.getByTestId(
        BILLING_TILE_TEST_IDS.billingInformationsTile,
      );
      expect(mockedBillingTile).toBeInTheDocument();
      expect(mockedBillingTile).toHaveAttribute('id', okmsMocked.id);

      await user.click(mockedBillingTile);
      expect(mockNavigate).toHaveBeenCalledWith(resiliateLink);
    },
  );
});
