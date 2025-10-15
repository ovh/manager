import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { initTestI18n, labels } from '@/utils/tests/init.i18n';
import { renderWithClient } from '@/utils/tests/testUtils';
import useProductType, { ProductType } from '@/common/hooks/useProductType';
import { SECRETS_TILE_TEST_IDS } from './SecretsTile.constants';
import { SecretsTile } from './SecretsTile.component';

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

vi.mock('./items/SecretCountTileItem.component', async (original) => ({
  ...(await original()),
  SecretCountTileItem: vi.fn(() => (
    <div data-testid={SECRETS_TILE_TEST_IDS.secretCount} />
  )),
}));

vi.mock('./items/SecretVersionCountTileItem.component', async (original) => ({
  ...(await original()),
  SecretVersionCountTileItem: vi.fn(() => (
    <div data-testid={SECRETS_TILE_TEST_IDS.secretVersionCount} />
  )),
}));

vi.mock('./items/SecretListLinkTileItem.component', async (original) => ({
  ...(await original()),
  SecretListLinkTileItem: vi.fn(() => (
    <div data-testid={SECRETS_TILE_TEST_IDS.linkToSecretList} />
  )),
}));

const renderTile = async () => {
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  return renderWithClient(
    <I18nextProvider i18n={i18nValue}>
      <SecretsTile okms={okmsMock[0]} />
    </I18nextProvider>,
  );
};

describe('OKMS Secrets Tile test suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display tile content', async () => {
    // GIVEN
    const tileItems = [
      SECRETS_TILE_TEST_IDS.secretCount,
      SECRETS_TILE_TEST_IDS.secretVersionCount,
    ];

    // WHEN
    await renderTile();

    // THEN
    expect(
      screen.getByText(
        labels.listing.key_management_service_listing_secret_cell,
      ),
    ).toBeVisible();

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
      visibleTileItems: [SECRETS_TILE_TEST_IDS.linkToSecretList],
    },
    {
      productType: 'secret-manager',
      invisibleTileItems: [SECRETS_TILE_TEST_IDS.linkToSecretList],
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
