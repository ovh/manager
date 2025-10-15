import { screen } from '@testing-library/react';
import React from 'react';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { labels } from '@/utils/tests/init.i18n';
import { ServiceKeyCountTileItem } from './ServiceKeyCountTileItem.component';
import { renderWithI18n } from '@/utils/tests/testUtils';

const okmsMocked = okmsMock[0];

describe('OKMS Service Key count Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    await renderWithI18n(<ServiceKeyCountTileItem okms={okmsMocked} />);

    // THEN
    expect(
      screen.getByText(labels.dashboard.okms_service_key_count),
    ).toBeVisible();
    expect(screen.getByText(okmsMocked.serviceKeyCount)).toBeVisible();
  });
});
