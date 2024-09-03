import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrganizationDataProtectionTile from './OrganizationDataProtectionTile.component';

const renderComponent = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <OrganizationDataProtectionTile />
    </QueryClientProvider>,
  );
};

describe('OrganizationDataProtectionTile component unit test suite', () => {
  it('should define all sections with correct typo', () => {
    // when
    const { getByText } = renderComponent();

    // then
    const dataTitle = getByText('managed_vcd_dashboard_data_protection');
    expect(dataTitle).toHaveAttribute('size', ODS_THEME_TYPOGRAPHY_SIZE._400);
    expect(dataTitle).toHaveAttribute(
      'level',
      ODS_THEME_TYPOGRAPHY_LEVEL.heading,
    );

    // and
    const backupTitle = getByText('Managed Backup');
    expect(backupTitle).toHaveAttribute('size', ODS_THEME_TYPOGRAPHY_SIZE._200);
    expect(backupTitle).toHaveAttribute(
      'level',
      ODS_THEME_TYPOGRAPHY_LEVEL.heading,
    );

    // and
    const recoveryTitle = getByText('Managed Backup');
    expect(recoveryTitle).toHaveAttribute(
      'size',
      ODS_THEME_TYPOGRAPHY_SIZE._200,
    );
    expect(recoveryTitle).toHaveAttribute(
      'level',
      ODS_THEME_TYPOGRAPHY_LEVEL.heading,
    );
  });
});
