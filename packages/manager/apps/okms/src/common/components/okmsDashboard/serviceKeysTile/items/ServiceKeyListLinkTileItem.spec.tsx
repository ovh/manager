import { screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { LinksProps, LinkType } from '@ovh-ux/manager-react-components';
import userEvent from '@testing-library/user-event';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { labels } from '@/utils/tests/init.i18n';
import { ServiceKeyListLinkTileItem } from './ServiceKeyListLinkTileItem.component';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import { renderWithI18n } from '@/utils/tests/testUtils';

const okmsMocked = okmsMock[0];

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();
  return {
    ...actual,
    Links: ({ onClickReturn, ...rest }: LinksProps) => (
      <a
        data-testid={'service-key-list-link'}
        onClick={onClickReturn}
        {...rest}
      />
    ),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const mod = await importOriginal<
    typeof import('@ovh-ux/manager-react-shell-client')
  >();

  return {
    ...mod,
    useOvhTracking: () => ({ trackClick: vi.fn() }),
  };
});

describe('OKMS Service Key List link Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    const user = userEvent.setup();
    // GIVEN okmsMocked

    // WHEN
    await renderWithI18n(<ServiceKeyListLinkTileItem okms={okmsMocked} />);

    // THEN
    const secretListLink = screen.getByTestId('service-key-list-link');

    expect(secretListLink).toBeVisible();
    expect(secretListLink).toHaveAttribute(
      'label',
      labels.kmsCommon.manage_service_keys_link,
    );
    expect(secretListLink).toHaveAttribute('type', LinkType.next);

    await user.click(secretListLink);
    expect(mockNavigate).toHaveBeenCalledWith(
      KMS_ROUTES_URLS.serviceKeyListing(okmsMocked.id),
    );
  });
});
