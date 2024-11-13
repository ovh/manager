import React from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import {
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { datacentreList } from '@ovh-ux/manager-module-vcd-api';
import DatacentreUsageTile from './DatacentreUsageTile.component';

type TTileItem = {
  label: HTMLElement;
  value: HTMLElement;
};

const testVDC = datacentreList[0];

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options: Record<string, unknown>) => {
      if (key === 'managed_vcd_vdc_vcpu_value') {
        return `${options.speed} GHz`;
      }
      return key;
    },
  }),
}));

describe('DatacentreUsageTile component unit test suite', () => {
  it('should define all sections with correct typo', () => {
    // when
    const { getByText } = render(
      <DatacentreUsageTile vcdDatacentre={testVDC} />,
    );

    // then
    const usageTitle = getByText('managed_vcd_vdc_usage');
    expect(usageTitle).toBeVisible();

    // and
    const tileItems: TTileItem[] = [
      {
        label: getByText('managed_vcd_vdc_vcpu_speed'),
        value: getByText(`${testVDC.currentState.vCPUSpeed} GHz`),
      },
      {
        label: getByText('managed_vcd_vdc_vcpu_count'),
        value: getByText(testVDC.currentState.vCPUCount),
      },
    ];

    tileItems.forEach((item: TTileItem) => {
      expect(item.label).toBeVisible();
      expect(item.value).toBeVisible();

      expect(item.label).toHaveAttribute(
        'size',
        ODS_THEME_TYPOGRAPHY_SIZE._200,
      );
      expect(item.label).toHaveAttribute(
        'level',
        ODS_THEME_TYPOGRAPHY_LEVEL.heading,
      );
    });
  });
});
