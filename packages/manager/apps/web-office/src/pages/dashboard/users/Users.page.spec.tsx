import React from 'react';
import { describe, expect, vi } from 'vitest';
import Users from './Users.page';
import { render } from '@/utils/test.provider';
import {
  licensesMock,
  licensesPrepaidExpandedMock,
  usersMock,
} from '@/data/api/__mocks__';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

const hoistedMock = vi.hoisted(() => ({
  useUsers: vi.fn(),
  useLicenseDetail: vi.fn(),
}));

vi.mock('@/data/hooks', async (importActual) => {
  const actual = await importActual<typeof import('@/data/hooks')>();
  return {
    ...actual,
    useUsers: hoistedMock.useUsers,
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
    expect(orderButton).toHaveAttribute('label', commonTranslation.order_users);
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
    expect(orderButton).toHaveAttribute(
      'label',
      commonTranslation.order_licenses,
    );
  });
});
