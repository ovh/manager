import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { LinkType, LinksProps } from '@ovh-ux/manager-react-components';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

import { SecretListLinkTileItem } from './SecretListLinkTileItem.component';

const okmsMocked = okmsRoubaix1Mock;

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    Links: ({ onClickReturn, ...rest }: LinksProps) => (
      <a data-testid={'secret-list-link'} onClick={onClickReturn} {...rest} />
    ),
  };
});

describe('OKMS Secret List link Tile Item test suite', () => {
  it('should render the tile item correctly', async () => {
    const user = userEvent.setup();
    // GIVEN okmsMocked

    // WHEN
    await renderWithI18n(<SecretListLinkTileItem okms={okmsMocked} />);

    // THEN
    const secretListLink = screen.getByTestId('secret-list-link');

    expect(secretListLink).toBeVisible();
    expect(secretListLink).toHaveAttribute('label', labels.kmsCommon.manage_secrets_link);
    expect(secretListLink).toHaveAttribute('type', LinkType.next);

    await act(async () => {
      await user.click(secretListLink);
    });
    expect(mockNavigate).toHaveBeenCalledWith(SECRET_MANAGER_ROUTES_URLS.secretList(okmsMocked.id));
  });
});
