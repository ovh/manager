import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LinkType } from '@/common/components/link/Link.component';
import { SECRET_CONFIG_TILE_TEST_IDS } from '@/common/components/okms-dashboard/secret-config-tile/SecretConfigTile.constants';
import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { EditSecretConfigLinkTileItem } from './EditSecretConfigLinkTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

describe('OKMS edit secret config link Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    const wrapper = await testWrapperBuilder()
      .withI18next()
      .withRouterContext()
      .withShellContext()
      .build();

    render(<EditSecretConfigLinkTileItem okms={okmsMocked} />, { wrapper });

    const secretListLink = screen.getByTestId(SECRET_CONFIG_TILE_TEST_IDS.editSecretConfigLink);

    expect(secretListLink).toBeVisible();
    expect(secretListLink).toHaveAttribute('type', LinkType.next);
    expect(secretListLink).toHaveTextContent(labels.secretManager.edit_metadata);
    expect(secretListLink.getAttribute('to')).toBe(
      SECRET_MANAGER_ROUTES_URLS.okmsUpdateSecretConfigDrawer(okmsMocked.id),
    );
  });
});
