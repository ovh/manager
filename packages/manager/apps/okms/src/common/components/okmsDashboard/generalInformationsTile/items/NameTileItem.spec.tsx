import { screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import userEvent from '@testing-library/user-event';
import { NameTileItem } from './NameTileItem.component';
import { okmsMock } from '@/mocks/kms/okms.mock';
import useProductType, { ProductType } from '@/common/hooks/useProductType';
import { getOdsButtonByIcon } from '@/utils/tests/uiTestHelpers';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import { labels } from '@/utils/tests/init.i18n';
import { renderWithI18n } from '@/utils/tests/testUtils';

const okmsMocked = okmsMock[0];

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/common/hooks/useProductType');

const renderTileItem = async () => {
  return renderWithI18n(<NameTileItem okms={okmsMocked} />);
};

describe('OKMS Name Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN
    vi.mocked(useProductType).mockReturnValue('key-management-service');

    // WHEN
    const { container } = await renderTileItem();

    // THEN
    expect(
      screen.getByText(labels.common.dashboard.display_name),
    ).toBeVisible();
    expect(screen.getByText(okmsMocked.iam.displayName)).toBeVisible();
    const editNameButton = await getOdsButtonByIcon({
      container,
      iconName: 'pen',
    });

    expect(editNameButton).toBeVisible();
  });

  type TestCases = {
    productType: ProductType;
    expectedLink: string;
  };

  const testCases: TestCases[] = [
    {
      productType: 'key-management-service',
      expectedLink: KMS_ROUTES_URLS.kmsEditName(okmsMocked.id),
    },
    {
      productType: 'secret-manager',
      expectedLink: SECRET_MANAGER_ROUTES_URLS.okmsUpdateNameModal(
        okmsMocked.id,
      ),
    },
  ];

  it.each(testCases)(
    'should render edit name button with correct link for $productType',
    async ({ productType, expectedLink }) => {
      const user = userEvent.setup();
      // GIVEN
      vi.mocked(useProductType).mockReturnValue(productType);

      // WHEN
      const { container } = await renderTileItem();

      // THEN
      const editNameButton = await getOdsButtonByIcon({
        container,
        iconName: 'pen',
      });

      expect(editNameButton).toBeVisible();

      await user.click(editNameButton);
      expect(mockNavigate).toHaveBeenCalledWith(expectedLink);
    },
  );
});
