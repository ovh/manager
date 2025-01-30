import React from 'react';
import { describe, expect, vi } from 'vitest';
import Users from '../Users';
import { render } from '@/utils/test.provider';
import {
  licensesMock,
  licensesPrepaidExpandedMock,
  usersMock,
} from '@/api/_mock_';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

const hoistedMock = vi.hoisted(() => ({
  useOfficeUsers: vi.fn(),
  useOfficeLicenseDetail: vi.fn(),
}));

vi.mock('@/hooks', async (importActual) => {
  const actual = await importActual<typeof import('@/hooks')>();
  return {
    ...actual,
    useOfficeUsers: hoistedMock.useOfficeUsers,
    useOfficeLicenseDetail: hoistedMock.useOfficeLicenseDetail,
  };
});

describe('Users page', () => {
  it('Page for payAsYouGo', () => {
    hoistedMock.useOfficeLicenseDetail.mockReturnValue({
      data: licensesMock[0],
      isLoading: false,
    });
    hoistedMock.useOfficeUsers.mockReturnValue({
      data: usersMock,
      isLoading: false,
    });

    const { getByTestId } = render(<Users />);
    const orderButton = getByTestId('users-order-button');
    expect(orderButton).toHaveAttribute('label', commonTranslation.order_users);
  });

  it('Page for prepaid', () => {
    hoistedMock.useOfficeLicenseDetail.mockReturnValue({
      data: licensesPrepaidExpandedMock[0],
      isLoading: false,
    });
    hoistedMock.useOfficeUsers.mockReturnValue({
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
