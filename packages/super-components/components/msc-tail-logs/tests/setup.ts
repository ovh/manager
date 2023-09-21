import { newSpecPage, newE2EPage } from '@stencil/core/testing';
import { OdsStringAttributes2Str } from '@ovhcloud/ods-common-testing';
import { defaultLocale } from '@ovhcloud/msc-utils';
import { MscTailLogs, IMscTailLogs } from '../src';
import { MscTailLogsCode } from '../src/msc-tail-logs/msc-tail-logs-code';
import { config } from '../mock/handlers';
import tradFR from '../src/translations/Messages_fr_FR.json';
import {
  mockRequests,
  e2eMockResponseHandler,
} from '../../../_common/mock-helpers';

const defaultAttributes = {
  source:
    'cloud/project/11111111111111111111/database/mongodb/11111111-11111-111111-1111111111/logs',
  locale: defaultLocale,
};

export const setupSpecTest = async (attributes: Partial<IMscTailLogs> = {}) => {
  const mock = mockRequests(config);
  const stringAttributes = { ...defaultAttributes, ...attributes };
  const page = await newSpecPage({
    components: [MscTailLogs, MscTailLogsCode],
    html: `<msc-tail-logs ${OdsStringAttributes2Str(
      stringAttributes,
    )}></msc-tail-logs>`,
  });

  await page.waitForChanges();

  const tailLogs = page.root?.shadowRoot as ShadowRoot;
  const toggleButton = page.root?.shadowRoot?.querySelector('osds-toggle');
  const codeBlock = page.root?.shadowRoot?.querySelector('osds-code');
  const code = page.root?.shadowRoot?.querySelector('msc-tail-logs-code');

  return { page, mock, tradFR, tailLogs, toggleButton, codeBlock, code };
};

export const setupE2eTest = async (attributes: Partial<IMscTailLogs> = {}) => {
  const stringAttributes = { ...defaultAttributes, ...attributes };

  const page = await newE2EPage({ timeout: 30000 });

  await page.setRequestInterception(true);

  page.on('response', e2eMockResponseHandler({ page, handlers: config }));

  await page.setContent(
    `<msc-tail-logs ${OdsStringAttributes2Str(
      stringAttributes,
    )}></msc-tail-logs>`,
    { timeout: 30000 },
  );

  await page.waitForChanges();

  await page.evaluate(() => document.body.style.setProperty('margin', '0px'));

  const el = await page.find('msc-tail-logs');

  return { page, el };
};
