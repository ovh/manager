import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import VcdOptionsTile from './VcdOptionsTile.component';

describe('VcdOptionsTile component unit test suite', () => {
  it('should define all sections with correct typo', () => {
    // when
    const { getByText } = render(<VcdOptionsTile />);

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
    const licenceTitle = getByText('managed_vcd_dashboard_windows_licence');
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
