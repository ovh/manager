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
import BillingTile from './BillingTile.component';

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
        <BillingTile id="testId" />
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

describe.skip('BillingTile component unit test suite', () => {
  it('should define all sections with correct typo', () => {
    // when
    const { getByText } = renderComponent();

    // then
    const billingTitle = getByText('managed_vcd_dashboard_service_management');
    expect(billingTitle).toHaveAttribute(
      'size',
      ODS_THEME_TYPOGRAPHY_SIZE._400,
    );
    expect(billingTitle).toHaveAttribute(
      'level',
      ODS_THEME_TYPOGRAPHY_LEVEL.heading,
    );

    // and
    const mailingTitle = getByText('managed_vcd_dashboard_mailing_list');
    const renewTitle = getByText('managed_vcd_dashboard_service_renew');
    const cancelTitle = getByText('managed_vcd_dashboard_service_cancellation');
    const pwdTitle = getByText('managed_vcd_dashboard_password');
    const subtitles = [mailingTitle, renewTitle, cancelTitle, pwdTitle];

    subtitles.forEach((title: HTMLElement) => {
      expect(title).toHaveAttribute('size', ODS_THEME_TYPOGRAPHY_SIZE._200);
      expect(title).toHaveAttribute(
        'level',
        ODS_THEME_TYPOGRAPHY_LEVEL.heading,
      );
    });
  });
});
