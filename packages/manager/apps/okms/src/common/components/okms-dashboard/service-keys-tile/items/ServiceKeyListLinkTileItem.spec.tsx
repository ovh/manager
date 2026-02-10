import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LinkType } from '@/common/components/link/Link.component';
import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { SERVICE_KEYS_TILE_TEST_IDS } from '../ServiceKeysTile.constants';
import { ServiceKeyListLinkTileItem } from './ServiceKeyListLinkTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

describe('OKMS Service Key List link Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    const wrapper = await testWrapperBuilder()
      .withI18next()
      .withRouterContext()
      .withShellContext()
      .build();

    render(<ServiceKeyListLinkTileItem okms={okmsMocked} />, { wrapper });

    const secretListLink = screen.getByTestId(SERVICE_KEYS_TILE_TEST_IDS.serviceKeyListLink);

    expect(secretListLink).toBeVisible();
    expect(secretListLink).toHaveAttribute('type', LinkType.next);
    expect(secretListLink).toHaveTextContent(labels.kmsCommon.manage_service_keys_link);
    expect(secretListLink.getAttribute('to')).toBe(
      KMS_ROUTES_URLS.serviceKeyListing(okmsMocked.id),
    );
  });
});
