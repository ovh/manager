import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { screen } from '@testing-library/react';

import { renderWithI18n } from '@/common/utils/tests/testUtils';
import { getOdsClipboardByValue } from '@/common/utils/tests/uiTestHelpers';
import { ID_LABEL } from '@/constants';

import { IdTileItem } from './IdTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

describe('OKMS ID Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    const { container } = await renderWithI18n(<IdTileItem okms={okmsMocked} />);

    // THEN
    expect(screen.getByText(ID_LABEL)).toBeVisible();
    expect(getOdsClipboardByValue({ container, value: okmsMocked.id })).toBeVisible();
  });
});
