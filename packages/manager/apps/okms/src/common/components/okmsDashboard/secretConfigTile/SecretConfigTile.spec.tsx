import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { getSecretConfigOkms } from '@secret-manager/data/api/secretConfigOkms';
import { okmsMock } from '@key-management-service/mocks/kms/okms.mock';
import { initTestI18n, labels } from '@/common/utils/tests/init.i18n';
import { SecretConfigTile } from './SecretConfigTile.component';
import { SECRET_CONFIG_TILE_TEST_IDS } from './SecretConfigTile.constants';
import { renderWithClient } from '@/common/utils/tests/testUtils';

let i18nValue: i18n;

vi.mock(
  import('@secret-manager/data/api/secretConfigOkms'),
  async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      getSecretConfigOkms: vi.fn(),
    };
  },
);

const mockedGetSecretConfig = vi.mocked(getSecretConfigOkms);

vi.mock(
  './items/DeactivateVersionAfterTileItem.component',
  async (original) => ({
    ...(await original()),
    DeactivateVersionAfterTileItem: vi.fn(() => (
      <div data-testid={SECRET_CONFIG_TILE_TEST_IDS.deactivateVersionAfter} />
    )),
  }),
);

vi.mock('./items/MaxVersionTileItem.component', async (original) => ({
  ...(await original()),
  MaxVersionTileItem: vi.fn(() => (
    <div data-testid={SECRET_CONFIG_TILE_TEST_IDS.maxVersion} />
  )),
}));

vi.mock('./items/CasTileItem.component', async (original) => ({
  ...(await original()),
  CasTileItem: vi.fn(() => (
    <div data-testid={SECRET_CONFIG_TILE_TEST_IDS.cas} />
  )),
}));

vi.mock(
  '@/common/components/tileError/TileError.component',
  async (original) => ({
    ...(await original()),
    TileError: vi.fn(() => (
      <div data-testid={SECRET_CONFIG_TILE_TEST_IDS.tileError} />
    )),
  }),
);

const renderTile = async () => {
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  return renderWithClient(
    <I18nextProvider i18n={i18nValue}>
      <SecretConfigTile okms={okmsMock[0]} />
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
      expect(
        screen.getByTestId(SECRET_CONFIG_TILE_TEST_IDS.tileError),
      ).toBeVisible(),
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
});
