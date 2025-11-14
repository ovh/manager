import { screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { okmsMock } from '@key-management-service/mocks/kms/okms.mock';
import { labels } from '@/common/utils/tests/init.i18n';
import { KmipObjectsTile } from './KmipObjectsTile.component';
import { KMIP_OBJECTS_TILE_TEST_IDS } from './KmipObjectsTile.constants';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

vi.mock('./items/KmipObjectCountTileItem.component', async (original) => ({
  ...(await original()),
  KmipObjectCountTileItem: vi.fn(() => (
    <div data-testid={KMIP_OBJECTS_TILE_TEST_IDS.kmipObjectCount} />
  )),
}));

describe('OKMS Kmip Objects Tile test suite', () => {
  it('should display tile content', async () => {
    // GIVEN
    const tileItems = [KMIP_OBJECTS_TILE_TEST_IDS.kmipObjectCount];

    // WHEN
    await renderWithI18n(<KmipObjectsTile okms={okmsMock[0]} />);

    // THEN
    expect(screen.getByText(labels.dashboard.kmip_objects)).toBeVisible();
    tileItems.forEach((item) => {
      expect(screen.getByTestId(item)).toBeInTheDocument();
    });
  });
});
