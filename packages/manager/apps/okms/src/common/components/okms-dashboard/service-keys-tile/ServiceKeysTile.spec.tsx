import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { screen, waitFor } from '@testing-library/react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';

import { ProductType, useProductType } from '@/common/hooks/useProductType';
import { initTestI18n } from '@/common/utils/tests/init.i18n';
import { renderWithClient } from '@/common/utils/tests/testUtils';
import { SERVICE_KEYS_LABEL } from '@/constants';

import { ServiceKeysTile } from './ServiceKeysTile.component';
import { SERVICE_KEYS_TILE_TEST_IDS } from './ServiceKeysTile.constants';

const mockOkms = okmsRoubaix1Mock;

let i18nValue: i18n;

vi.mock('@/common/hooks/useProductType');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('./items/ServiceKeyCountTileItem.component', async (original) => ({
  ...(await original()),
  ServiceKeyCountTileItem: vi.fn(() => (
    <div data-testid={SERVICE_KEYS_TILE_TEST_IDS.serviceKeyCount} />
  )),
}));

vi.mock('./items/ServiceKeyListLinkTileItem.component', async (original) => ({
  ...(await original()),
  ServiceKeyListLinkTileItem: vi.fn(() => (
    <div data-testid={SERVICE_KEYS_TILE_TEST_IDS.serviceKeyListLink} />
  )),
}));

const renderTile = async () => {
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  return renderWithClient(
    <I18nextProvider i18n={i18nValue}>
      <ServiceKeysTile okms={mockOkms} />
    </I18nextProvider>,
  );
};

describe('OKMS Service Keys Tile test suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display tile content', async () => {
    // GIVEN
    const tileItems = [SERVICE_KEYS_TILE_TEST_IDS.serviceKeyCount];

    // WHEN
    await renderTile();

    // THEN
    expect(screen.getByText(SERVICE_KEYS_LABEL)).toBeVisible();

    await waitFor(() =>
      tileItems.forEach((item) => {
        expect(screen.getByTestId(item)).toBeInTheDocument();
      }),
    );
  });

  type UseCases = {
    productType: ProductType;
    visibleTileItems?: string[];
    invisibleTileItems?: string[];
  };

  const useCases: UseCases[] = [
    {
      productType: 'key-management-service',
      invisibleTileItems: [SERVICE_KEYS_TILE_TEST_IDS.serviceKeyListLink],
    },
    {
      productType: 'secret-manager',
      visibleTileItems: [SERVICE_KEYS_TILE_TEST_IDS.serviceKeyListLink],
    },
  ];

  it.each(useCases)(
    'should handle productType $productType',
    async ({ productType, visibleTileItems, invisibleTileItems }) => {
      // GIVEN
      vi.mocked(useProductType).mockReturnValue(productType);

      // WHEN
      await renderTile();

      // THEN
      visibleTileItems?.forEach((item) => {
        expect(screen.getByTestId(item)).toBeInTheDocument();
      });

      invisibleTileItems?.forEach((item) => {
        expect(screen.queryByTestId(item)).not.toBeInTheDocument();
      });
    },
  );
});
