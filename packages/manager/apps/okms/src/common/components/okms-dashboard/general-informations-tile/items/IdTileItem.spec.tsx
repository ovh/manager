import { screen } from '@testing-library/react';
import React from 'react';
import { okmsMock } from '@key-management-service/mocks/kms/okms.mock';
import { getOdsClipboardByValue } from '@/common/utils/tests/uiTestHelpers';
import { IdTileItem } from './IdTileItem.component';
import { ID_LABEL } from '@/constants';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

const okmsMocked = okmsMock[0];

describe('OKMS ID Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    const { container } = await renderWithI18n(
      <IdTileItem okms={okmsMocked} />,
    );

    // THEN
    expect(screen.getByText(ID_LABEL)).toBeVisible();
    expect(
      getOdsClipboardByValue({ container, value: okmsMocked.id }),
    ).toBeVisible();
  });
});
