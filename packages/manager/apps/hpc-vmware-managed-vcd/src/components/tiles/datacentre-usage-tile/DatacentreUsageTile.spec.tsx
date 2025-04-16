import React from 'react';
import { expect } from 'vitest';
import { render } from '@testing-library/react';
import { datacentreList } from '@ovh-ux/manager-module-vcd-api';
import { i18n as i18nType } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import {
  assertAsyncTextVisibility,
  assertTextVisibility,
  initTestI18n,
} from '@ovh-ux/manager-core-test-utils';
import DatacentreUsageTile from './DatacentreUsageTile.component';
import { labels, translations } from '../../../test-utils';
import { APP_NAME } from '../../../tracking.constants';

const testVDC = datacentreList[0];

let i18n: i18nType;
const renderComponent = async () => {
  if (!i18n) {
    i18n = await initTestI18n(APP_NAME, translations);
  }

  return render(
    <I18nextProvider i18n={i18n}>
      <DatacentreUsageTile vcdDatacentre={testVDC} />
    </I18nextProvider>,
  );
};

describe('DatacentreUsageTile component unit test suite', () => {
  it('should define tileTitle and sections', async () => {
    // when
    renderComponent();

    // then
    const elements = [
      labels.datacentres.managed_vcd_vdc_usage,
      labels.datacentres.managed_vcd_vdc_vcpu_speed,
      labels.datacentres.managed_vcd_vdc_vcpu_count,
      `${testVDC.currentState.vCPUSpeed} GHz`,
      testVDC.currentState.vCPUCount.toString(),
    ];

    // TESTING : check asynchronously for the first element, then check synchronously
    await assertAsyncTextVisibility(elements[0]);
    elements.slice(1).forEach(assertTextVisibility);
  });
});
