import { newSpecPage, newE2EPage } from '@stencil/core/testing';
import { OdsStringAttributes2Str } from '@ovhcloud/ods-testing';
import { OdsComponentAttributes2StringAttributes } from '@ovhcloud/ods-core';
import { MscBillingTile, IMscBillingTile } from '../src';

const defaultAttributes = {
  dataTracking: 'home::dashboard::test',
  servicePath: 'dedicated/nasha/zpool-128894',
  offer: 'zpool-128894',
};

export const setupSpecTest = async ({
  attributes = {
    dataTracking: 'home::dashboard::test',
    servicePath: 'dedicated/nasha/zpool-128894',
    offer: 'zpool-128894',
  },
  html = ``,
}: {
  attributes?: Partial<IMscBillingTile>;
  html?: string;
}) => {
  const stringAttributes = OdsComponentAttributes2StringAttributes<
    Partial<IMscBillingTile>
  >({ ...defaultAttributes, ...attributes }, defaultAttributes);
  const page = await newSpecPage({
    components: [MscBillingTile],
    html: `<msc-billing-tile ${OdsStringAttributes2Str(
      stringAttributes,
    )}>${html}</msc-billing-tile>`,
  });
  return { page };
};

export const setupE2eTest = async ({
  attributes = {},
  html = ``,
}: {
  attributes?: Partial<IMscBillingTile>;
  html?: string;
}) => {
  const stringAttributes = OdsComponentAttributes2StringAttributes<
    Partial<IMscBillingTile>
  >({ ...defaultAttributes, ...attributes }, defaultAttributes);

  const page = await newE2EPage();

  await page.setContent(
    `<msc-billing-tile ${OdsStringAttributes2Str(
      stringAttributes,
    )}>${html}</msc-billing-tile>`,
  );
  await page.evaluate(() => document.body.style.setProperty('margin', '0px'));

  const el = await page.find('msc-billing-tile');

  return { page, el };
};
