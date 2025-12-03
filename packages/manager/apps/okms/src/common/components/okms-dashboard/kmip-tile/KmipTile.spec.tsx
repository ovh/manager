import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import { renderWithI18n } from '@/common/utils/tests/testUtils';
import { KMIP_LABEL } from '@/constants';

import { KmipTile } from './KmipTile.component';
import { KMIP_TILE_TEST_IDS } from './KmipTile.constants';

const okmsMocked = okmsRoubaix1Mock;

vi.mock('./items/KmipEndpointTileItem.component', async (original) => ({
  ...(await original()),
  KmipEndpointTileItem: vi.fn(() => <div data-testid={KMIP_TILE_TEST_IDS.kmipEndpoint} />),
}));

vi.mock('./items/KmipEndpointRsaTileItem.component', async (original) => ({
  ...(await original()),
  KmipEndpointRsaTileItem: vi.fn(() => <div data-testid={KMIP_TILE_TEST_IDS.kmipEndpointRSA} />),
}));

describe('OKMS Kmip Tile test suite', () => {
  it('should display tile content', async () => {
    // GIVEN
    const tileItems = [KMIP_TILE_TEST_IDS.kmipEndpoint, KMIP_TILE_TEST_IDS.kmipEndpointRSA];

    // WHEN
    await renderWithI18n(<KmipTile okms={okmsMocked} />);

    // THEN
    expect(screen.getByText(KMIP_LABEL)).toBeVisible();
    tileItems.forEach((item) => {
      expect(screen.getByTestId(item)).toBeInTheDocument();
    });
  });
});
