import { screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { okmsMock } from '@key-management-service/mocks/kms/okms.mock';
import { KMIP_TILE_TEST_IDS } from './KmipTile.constants';
import { KMIP_LABEL } from '@/constants';
import { KmipTile } from './KmipTile.component';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

vi.mock('./items/KmipEndpointTileItem.component', async (original) => ({
  ...(await original()),
  KmipEndpointTileItem: vi.fn(() => (
    <div data-testid={KMIP_TILE_TEST_IDS.kmipEndpoint} />
  )),
}));

vi.mock('./items/KmipEndpointRsaTileItem.component', async (original) => ({
  ...(await original()),
  KmipEndpointRsaTileItem: vi.fn(() => (
    <div data-testid={KMIP_TILE_TEST_IDS.kmipEndpointRSA} />
  )),
}));

describe('OKMS Kmip Tile test suite', () => {
  it('should display tile content', async () => {
    // GIVEN
    const tileItems = [
      KMIP_TILE_TEST_IDS.kmipEndpoint,
      KMIP_TILE_TEST_IDS.kmipEndpointRSA,
    ];

    // WHEN
    await renderWithI18n(<KmipTile okms={okmsMock[0]} />);

    // THEN
    expect(screen.getByText(KMIP_LABEL)).toBeVisible();
    tileItems.forEach((item) => {
      expect(screen.getByTestId(item)).toBeInTheDocument();
    });
  });
});
