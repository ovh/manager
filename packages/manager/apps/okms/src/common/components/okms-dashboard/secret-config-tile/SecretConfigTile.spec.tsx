import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { getSecretConfigOkms } from '@secret-manager/data/api/secretConfigOkms';
import { screen, waitFor } from '@testing-library/react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';

import { ProductType, useProductType } from '@/common/hooks/useProductType';
import { initTestI18n, labels } from '@/common/utils/tests/init.i18n';
import { renderWithClient } from '@/common/utils/tests/testUtils';

import { SecretConfigTile } from './SecretConfigTile.component';
import { SECRET_CONFIG_TILE_TEST_IDS } from './SecretConfigTile.constants';

const mockOkms = okmsRoubaix1Mock;

let i18nValue: i18n;

vi.mock('@/common/hooks/useProductType');

vi.mock(import('@secret-manager/data/api/secretConfigOkms'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getSecretConfigOkms: vi.fn(),
  };
});

const mockedGetSecretConfig = vi.mocked(getSecretConfigOkms);

vi.mock('./items/DeactivateVersionAfterTileItem.component', async (original) => ({
  ...(await original()),
  DeactivateVersionAfterTileItem: vi.fn(() => (
    <div data-testid={SECRET_CONFIG_TILE_TEST_IDS.deactivateVersionAfter} />
  )),
}));

vi.mock('./items/MaxVersionTileItem.component', async (original) => ({
  ...(await original()),
  MaxVersionTileItem: vi.fn(() => <div data-testid={SECRET_CONFIG_TILE_TEST_IDS.maxVersion} />),
}));

vi.mock('./items/CasTileItem.component', async (original) => ({
  ...(await original()),
  CasTileItem: vi.fn(() => <div data-testid={SECRET_CONFIG_TILE_TEST_IDS.cas} />),
}));

vi.mock('./items/EditSecretConfigLinkTileItem.component', async (original) => ({
  ...(await original()),
  EditSecretConfigLinkTileItem: vi.fn(() => (
    <div data-testid={SECRET_CONFIG_TILE_TEST_IDS.editSecretConfigLink} />
  )),
}));

vi.mock('@/common/components/tile-error/TileError.component', async (original) => ({
  ...(await original()),
  TileError: vi.fn(() => <div data-testid={SECRET_CONFIG_TILE_TEST_IDS.tileError} />),
}));

const renderTile = async () => {
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  return renderWithClient(
    <I18nextProvider i18n={i18nValue}>
      <SecretConfigTile okms={mockOkms} />
    </I18nextProvider>,
  );
};

describe('OKMS Rest Api Tile test suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display TileError when get secret config fails', async () => {
    // GIVEN
    const mockError = new Error('Failed to create cart');
    mockedGetSecretConfig.mockRejectedValue(mockError);

    // WHEN
    await renderTile();

    // THEN
    await waitFor(() =>
      expect(screen.getByTestId(SECRET_CONFIG_TILE_TEST_IDS.tileError)).toBeVisible(),
    );
  });

  it('should display tile content', async () => {
    // GIVEN
    const tileItems = [
      SECRET_CONFIG_TILE_TEST_IDS.deactivateVersionAfter,
      SECRET_CONFIG_TILE_TEST_IDS.maxVersion,
      SECRET_CONFIG_TILE_TEST_IDS.cas,
    ];
    mockedGetSecretConfig.mockResolvedValue({
      casRequired: true,
      deactivateVersionAfter: '30d',
      maxVersions: 10,
    });

    // WHEN
    await renderTile();

    // THEN
    expect(screen.getByText(labels.dashboard.okms_secret_config)).toBeVisible();

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
      productType: 'secret-manager',
      visibleTileItems: [SECRET_CONFIG_TILE_TEST_IDS.editSecretConfigLink],
    },
    {
      productType: 'key-management-service',
      invisibleTileItems: [SECRET_CONFIG_TILE_TEST_IDS.editSecretConfigLink],
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
