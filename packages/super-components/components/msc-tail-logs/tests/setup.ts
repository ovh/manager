import { newSpecPage, newE2EPage } from '@stencil/core/testing';
import { OdsStringAttributes2Str } from '@ovhcloud/ods-testing';
import { OdsComponentAttributes2StringAttributes } from '@ovhcloud/ods-core';
import { MscTailLogs } from '../src';

import { LogEntry } from '../src/msc-tail-logs/types';

const LOGS_REFRESH_INTERVAL = 30000;

const defaultAttributes: Partial<LogEntry> = {
  isToggled: false,
  logsRefresh: LOGS_REFRESH_INTERVAL,
};

export const setupSpecTest = async ({
  attributes = {},
  html = ``,
}: {
  attributes?: Partial<LogEntry>;
  html?: string;
}) => {
  const stringAttributes = OdsComponentAttributes2StringAttributes<
    Partial<LogEntry>
  >({ ...defaultAttributes, ...attributes }, defaultAttributes);
  const page = await newSpecPage({
    components: [MscTailLogs],
    html: `<msc-tail-logs ${OdsStringAttributes2Str(
      stringAttributes,
    )}>${html}</msc-tail-logs>`,
  });
  return { page };
};

export const setupE2eTest = async ({
  attributes = {},
  html = ``,
}: {
  attributes?: Partial<LogEntry>;
  html?: string;
}) => {
  const stringAttributes = OdsComponentAttributes2StringAttributes<
    Partial<LogEntry>
  >({ ...defaultAttributes, ...attributes }, defaultAttributes);

  const page = await newE2EPage();

  await page.setContent(
    `<msc-tail-logs ${OdsStringAttributes2Str(
      stringAttributes,
    )}>${html}</msc-tail-logs>`,
  );
  await page.evaluate(() => document.body.style.setProperty('margin', '0px'));

  const el = await page.find('msc-tail-logs');

  return { page, el };
};
