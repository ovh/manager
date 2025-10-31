import { screen } from '@testing-library/react';
import React from 'react';
import { okmsMock } from '@key-management-service/mocks/kms/okms.mock';
import { labels } from '@/common/utils/tests/init.i18n';
import { SecretCountTileItem } from './SecretCountTileItem.component';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

const okmsMocked = okmsMock[0];

describe('OKMS Secret count Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    // GIVEN okmsMocked

    // WHEN
    await renderWithI18n(<SecretCountTileItem okms={okmsMocked} />);

    // THEN
    expect(screen.getByText(labels.dashboard.okms_secret_count)).toBeVisible();
    expect(screen.getByText(okmsMocked.secretCount)).toBeVisible();
  });
});
