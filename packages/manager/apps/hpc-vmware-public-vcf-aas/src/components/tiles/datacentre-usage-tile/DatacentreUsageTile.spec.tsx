import React from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { datacentreList } from '@ovh-ux/manager-module-vcd-api';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import DatacentreUsageTile from './DatacentreUsageTile.component';
import { labels } from '../../../test-utils';

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
  it('should define tileTitle and sections', async () => {
    // when
    render(<DatacentreUsageTile vcdDatacentre={testVDC} />);

    // then
    const elements = [
      labels.datacentres.managed_vcd_vdc_usage,
      labels.datacentres.managed_vcd_vdc_vcpu_speed,
      labels.datacentres.managed_vcd_vdc_vcpu_count,
      `${testVDC.currentState.vCPUSpeed} GHz`,
      testVDC.currentState.vCPUCount.toString(),
    ];

    elements.forEach(async (element) => assertTextVisibility(element));
  });
});
