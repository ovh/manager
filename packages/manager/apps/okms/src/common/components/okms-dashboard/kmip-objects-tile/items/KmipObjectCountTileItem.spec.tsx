import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { screen } from '@testing-library/react';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

import { KmipObjectCountTileItem } from './KmipObjectCountTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

describe('OKMS Kmip Object count Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    await renderWithI18n(<KmipObjectCountTileItem okms={okmsMocked} />);

    // THEN
    expect(screen.getByText(labels.dashboard.okms_kmip_object_count)).toBeInTheDocument();
    expect(screen.getByText(labels.dashboard.okms_kmip_object_count_tooltip)).toBeInTheDocument();

    expect(screen.getByText(okmsMocked.kmipObjectCount)).toBeInTheDocument();
  });
});
