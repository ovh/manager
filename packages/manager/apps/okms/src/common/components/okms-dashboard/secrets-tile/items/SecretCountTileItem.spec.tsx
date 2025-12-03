import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { screen } from '@testing-library/react';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

import { SecretCountTileItem } from './SecretCountTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

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
