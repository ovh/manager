import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrganizationOptionsTile from './OrganizationOptionsTile.component';

const renderComponent = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <OrganizationOptionsTile isLicenseActive={false} />
    </QueryClientProvider>,
  );
};

describe('OrganizationOptionsTile component unit test suite', () => {
  it('should define all sections with correct typo', () => {
    // when
    const { getByText } = renderComponent();

    // then
    const optionsTitle = getByText('managed_vcd_dashboard_options');
    expect(optionsTitle).toHaveAttribute(
      'size',
      ODS_THEME_TYPOGRAPHY_SIZE._400,
    );
    expect(optionsTitle).toHaveAttribute(
      'level',
      ODS_THEME_TYPOGRAPHY_LEVEL.heading,
    );

    // and
    const licenceTitle = getByText('managed_vcd_dashboard_windows_license');
    expect(licenceTitle).toHaveAttribute(
      'size',
      ODS_THEME_TYPOGRAPHY_SIZE._200,
    );
    expect(licenceTitle).toHaveAttribute(
      'level',
      ODS_THEME_TYPOGRAPHY_LEVEL.heading,
    );
  });
});
