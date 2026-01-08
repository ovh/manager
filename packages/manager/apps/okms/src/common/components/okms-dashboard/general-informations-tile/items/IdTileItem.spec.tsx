import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { screen } from '@testing-library/react';

import { renderWithI18n } from '@/common/utils/tests/testUtils';
import { assertClipboardVisibility } from '@/common/utils/tests/uiTestHelpers';
import { ID_LABEL } from '@/constants';

import { IdTileItem } from './IdTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

describe('OKMS ID Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    await renderWithI18n(<IdTileItem okms={okmsMocked} />);

    // THEN
    expect(screen.getByText(ID_LABEL)).toBeVisible();
    await assertClipboardVisibility(okmsMocked.id);
  });
});
