import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LinkType } from '@/common/components/link/Link.component';
import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { SecretListLinkTileItem } from './SecretListLinkTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

describe('OKMS Secret List link Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    const wrapper = await testWrapperBuilder()
      .withI18next()
      .withRouterContext()
      .withShellContext()
      .build();

    render(<SecretListLinkTileItem okms={okmsMocked} />, { wrapper });

    const secretListLink = screen.getByText(labels.kmsCommon.manage_secrets_link);

    expect(secretListLink).toBeVisible();
    expect(secretListLink).toHaveAttribute('type', LinkType.next);
    expect(secretListLink.getAttribute('to')).toBe(
      SECRET_MANAGER_ROUTES_URLS.secretList(okmsMocked.id),
    );
  });
});
