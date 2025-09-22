import { describe, expect, vi } from 'vitest';

import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { licensesMock, licensesPrepaidExpandedMock } from '@/data/api/__mocks__/license';
import { usersMock } from '@/data/api/__mocks__/user';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/Test.provider';

import Users from '../Users.page';

const hoistedMock = vi.hoisted(() => ({
  useUsers: vi.fn(),
  useLicenseDetail: vi.fn(),
}));

vi.mock('@/data/hooks/users/useUsers', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/hooks/users/useUsers')>()),
    useUsers: hoistedMock.useUsers,
  };
});

vi.mock('@/data/hooks/license-details/useLicenseDetails', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/hooks/license-details/useLicenseDetails')>()),
    useLicenseDetail: hoistedMock.useLicenseDetail,
  };
});

describe('Users page', () => {
  it('Page for payAsYouGo', () => {
    hoistedMock.useLicenseDetail.mockReturnValue({
      data: licensesMock[0],
      isLoading: false,
    });
    hoistedMock.useUsers.mockReturnValue({
      data: usersMock,
      isLoading: false,
    });

    const { getByTestId } = render(<Users />);
    const orderButton = getByTestId('users-order-button');
    expect(orderButton).toHaveAttribute('label', actions.order_users);
  });

  it('Page for prepaid', () => {
    hoistedMock.useLicenseDetail.mockReturnValue({
      data: licensesPrepaidExpandedMock[0],
      isLoading: false,
    });
    hoistedMock.useUsers.mockReturnValue({
      data: licensesPrepaidExpandedMock[0],
      isLoading: false,
    });

    const { getByTestId } = render(<Users />);
    const orderButton = getByTestId('licenses-order-button');
    expect(orderButton).toHaveAttribute('label', commonTranslation.users_order_licenses);
  });
});
