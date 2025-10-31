import { screen } from '@testing-library/react';
import React from 'react';
import { okmsMock } from '@key-management-service/mocks/kms/okms.mock';
import { labels } from '@/common/utils/tests/init.i18n';
import { RegionTileItem } from './RegionTileItem.component';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

const okmsMocked = okmsMock[0];

describe('OKMS region Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    await renderWithI18n(<RegionTileItem okms={okmsMocked} />);

    // THEN
    expect(screen.getByText(labels.common.region.region)).toBeVisible();

    // hack to be able to test the region translation.
    const okmsRegion = `region_${okmsMocked.region}` as keyof typeof labels.common.region;

    expect(screen.getByText(labels.common.region[okmsRegion])).toBeVisible();
  });
});
