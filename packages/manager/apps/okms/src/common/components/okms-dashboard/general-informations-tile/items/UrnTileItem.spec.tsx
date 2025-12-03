import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { screen } from '@testing-library/react';

import { renderWithI18n } from '@/common/utils/tests/testUtils';
import { getOdsClipboardByValue } from '@/common/utils/tests/uiTestHelpers';
import { URN_LABEL } from '@/constants';

import { UrnTileItem } from './UrnTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

describe('OKMS Urn Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    const { container } = await renderWithI18n(<UrnTileItem okms={okmsMocked} />);

    // THEN
    expect(screen.getByText(URN_LABEL)).toBeVisible();
    expect(getOdsClipboardByValue({ container, value: okmsMocked.iam.urn })).toBeVisible();
  });
});
