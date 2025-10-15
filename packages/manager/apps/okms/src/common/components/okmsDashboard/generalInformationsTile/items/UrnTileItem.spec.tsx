import { screen } from '@testing-library/react';
import React from 'react';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { getOdsClipboardByValue } from '@/utils/tests/uiTestHelpers';
import { URN_LABEL } from '@/constants';
import { UrnTileItem } from './UrnTileItem.component';
import { renderWithI18n } from '@/utils/tests/testUtils';

const okmsMocked = okmsMock[0];

describe('OKMS Urn Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    const { container } = await renderWithI18n(
      <UrnTileItem okms={okmsMocked} />,
    );

    // THEN
    expect(screen.getByText(URN_LABEL)).toBeVisible();
    expect(
      getOdsClipboardByValue({ container, value: okmsMocked.iam.urn }),
    ).toBeVisible();
  });
});
