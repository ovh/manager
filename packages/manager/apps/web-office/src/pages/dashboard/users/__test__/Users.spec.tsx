import React from 'react';
import { describe, expect, vi } from 'vitest';
import Users from '../Users';
import { render } from '@/utils/test.provider';
import usersTranslation from '@/public/translations/dashboard/users/Messages_fr_FR.json';
import { licensesMock, usersMock } from '@/api/_mock_';

describe('Users page', () => {
  vi.mock('@/hooks', () => {
    return {
      useOfficeUsers: vi.fn(() => usersMock),
      useOfficeLicenseDetail: vi.fn(() => licensesMock),
    };
  });

  it('Page should display correctly', async () => {
    const { findByText } = render(<Users />);
    expect(
      await findByText(usersTranslation.dashboard_users_download_info),
    ).toBeVisible();
  });
});
