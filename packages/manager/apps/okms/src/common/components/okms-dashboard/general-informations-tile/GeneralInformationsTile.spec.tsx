import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

import { GeneralInformationsTile } from './GeneralInformationsTile.component';
import { GENERAL_INFORMATIONS_TILE_TEST_IDS } from './GeneralInformationsTile.constants';

const mockOkms = okmsRoubaix1Mock;

vi.mock('./items/NameTileItem.component', async (original) => ({
  ...(await original()),
  NameTileItem: vi.fn(() => <div data-testid={GENERAL_INFORMATIONS_TILE_TEST_IDS.name} />),
}));

vi.mock('./items/RegionTileItem.component', async (original) => ({
  ...(await original()),
  RegionTileItem: vi.fn(() => <div data-testid={GENERAL_INFORMATIONS_TILE_TEST_IDS.region} />),
}));

vi.mock('./items/IdTileItem.component', async (original) => ({
  ...(await original()),
  IdTileItem: vi.fn(() => <div data-testid={GENERAL_INFORMATIONS_TILE_TEST_IDS.id} />),
}));

vi.mock('./items/UrnTileItem.component', async (original) => ({
  ...(await original()),
  UrnTileItem: vi.fn(() => <div data-testid={GENERAL_INFORMATIONS_TILE_TEST_IDS.urn} />),
}));

describe('OKMS General Informations Tile test suite', () => {
  it('should display tile content', async () => {
    // GIVEN
    const tileItems = [
      GENERAL_INFORMATIONS_TILE_TEST_IDS.name,
      GENERAL_INFORMATIONS_TILE_TEST_IDS.region,
      GENERAL_INFORMATIONS_TILE_TEST_IDS.id,
      GENERAL_INFORMATIONS_TILE_TEST_IDS.urn,
    ];

    // WHEN
    await renderWithI18n(<GeneralInformationsTile okms={mockOkms} />);

    // THEN
    expect(screen.getByText(labels.common.dashboard.general_information)).toBeVisible();
    tileItems.forEach((item) => {
      expect(screen.getByTestId(item)).toBeInTheDocument();
    });
  });
});
