import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { screen } from '@testing-library/react';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

import { RegionTileItem } from './RegionTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

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
