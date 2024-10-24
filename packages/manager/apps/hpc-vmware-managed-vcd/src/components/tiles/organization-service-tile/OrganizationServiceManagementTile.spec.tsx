import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import OrganizationServiceManagementTile from './OrganizationServiceManagementTile.component';

const shellContext = {
  environment: {
    getUser: vi.fn(),
    getUserLocale: vi.fn().mockReturnValue('fr_FR'),
  },
};

const renderComponent = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <OrganizationServiceManagementTile />
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

describe('ServiceManagementTile component unit test suite', () => {
  it('should define all sections with correct typo', () => {
    // when
    const { getByText } = renderComponent();

    // then
    const serviceTile = getByText('managed_vcd_dashboard_service_management');
    expect(serviceTile).toHaveAttribute('size', ODS_THEME_TYPOGRAPHY_SIZE._400);
    expect(serviceTile).toHaveAttribute(
      'level',
      ODS_THEME_TYPOGRAPHY_LEVEL.heading,
    );

    // and
    const renewTitle = getByText('managed_vcd_dashboard_service_renew');
    const cancelTitle = getByText('managed_vcd_dashboard_service_cancellation');
    const pwdTitle = getByText('managed_vcd_dashboard_password');
    const contactTitle = getByText('managed_vcd_dashboard_contact_list');
    const subtitles = [renewTitle, cancelTitle, pwdTitle, contactTitle];

    subtitles.forEach((title: HTMLElement) => {
      expect(title).toHaveAttribute('size', ODS_THEME_TYPOGRAPHY_SIZE._200);
      expect(title).toHaveAttribute(
        'level',
        ODS_THEME_TYPOGRAPHY_LEVEL.heading,
      );
    });
  });
});
