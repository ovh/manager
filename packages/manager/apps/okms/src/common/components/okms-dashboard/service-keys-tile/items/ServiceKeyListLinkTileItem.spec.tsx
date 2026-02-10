import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { LinkType } from '@/common/components/link/Link.component';
import { labels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

import { ServiceKeyListLinkTileItem } from './ServiceKeyListLinkTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => mockNavigate,
  };
});

describe('OKMS Service Key List link Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    const user = userEvent.setup();
    // GIVEN okmsMocked

    // WHEN
    await renderWithI18n(<ServiceKeyListLinkTileItem okms={okmsMocked} />);

    // THEN
    const secretListLink = screen.getByText(labels.kmsCommon.manage_service_keys_link);

    expect(secretListLink).toBeVisible();
    expect(secretListLink).toHaveAttribute('type', LinkType.next);

    await user.click(secretListLink);
    expect(mockNavigate).toHaveBeenCalledWith(KMS_ROUTES_URLS.serviceKeyListing(okmsMocked.id));
  });
});
