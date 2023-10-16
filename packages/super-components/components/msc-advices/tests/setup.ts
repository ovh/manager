import { newSpecPage, newE2EPage, E2EElement } from '@stencil/core/testing';
import { OdsStringAttributes2Str } from '@ovhcloud/ods-common-testing';
import { defaultLocale } from '@ovhcloud/msc-utils';
import { MscAdvices, IMscAdvices } from '../src';
import { config } from '../mock/handlers';
import {
  mockRequests,
  e2eMockResponseHandler,
} from '../../../_common/mock-helpers';

import tradFR from '../src/translations/Messages_fr_FR.json';
import tradEN from '../src/translations/Messages_en_GB.json';

const defaultAttributes = {
  serviceType: 'vps',
  serviceName: 'vps-abcd1234.vps.ovh.net',
  locale: defaultLocale,
};

export const setupSpecTest = async (attributes?: Partial<IMscAdvices>) => {
  const mock = mockRequests(config, 'aapi');
  const stringAttributes = { ...defaultAttributes, ...attributes };
  const page = await newSpecPage({
    components: [MscAdvices],
    html: `<msc-advices ${OdsStringAttributes2Str(
      stringAttributes,
    )}></msc-advices>`,
  });
  const advicesTile = page.root?.shadowRoot as ShadowRoot;
  const [title] = Array.from(
    advicesTile.querySelectorAll('osds-text') as NodeList,
  );

  return { title, page, advicesTile, mock, tradFR, tradEN };
};

export const setupE2eTest = async (attributes?: Partial<IMscAdvices>) => {
  const stringAttributes = { ...defaultAttributes, ...attributes };

  const page = await newE2EPage({ timeout: 30000 });

  await page.setRequestInterception(true);

  page.on(
    'response',
    e2eMockResponseHandler({ page, handlers: config, apiVersion: 'aapi' }),
  );

  await page.setContent(
    `<msc-advices ${OdsStringAttributes2Str(stringAttributes)}></msc-advices>`,
    { timeout: 30000 },
  );

  await page.waitForChanges();

  await page.evaluate(() => document.body.style.setProperty('margin', '0px'));

  await page.find('.msc-advices-wrapper');
  const el: E2EElement = await page.find('msc-advices');

  return { page, el };
};
