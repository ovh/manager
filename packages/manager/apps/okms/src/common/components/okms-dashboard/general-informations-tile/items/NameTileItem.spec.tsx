import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { ProductType, useProductType } from '@/common/hooks/useProductType';
import { labels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

import { NameTileItem } from './NameTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

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
    await renderTileItem();

    // THEN
    expect(screen.getByText(labels.common.dashboard.display_name)).toBeVisible();
    expect(screen.getByText(okmsMocked.iam.displayName)).toBeVisible();

    expect(screen.getByRole('button', { name: 'edit' })).toBeVisible();
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
      expectedLink: SECRET_MANAGER_ROUTES_URLS.okmsUpdateNameModal(okmsMocked.id),
    },
  ];

  it.each(testCases)(
    'should render edit name button with correct link for $productType',
    async ({ productType, expectedLink }) => {
      const user = userEvent.setup();
      // GIVEN
      vi.mocked(useProductType).mockReturnValue(productType);

      // WHEN
      await renderTileItem();

      // THEN
      const editNameButton = screen.getByRole('button', { name: 'edit' });
      expect(editNameButton).toBeVisible();

      await user.click(editNameButton);

      expect(mockNavigate).toHaveBeenCalledWith(expectedLink);
    },
  );
});
