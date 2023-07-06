import { newSpecPage, newE2EPage } from '@stencil/core/testing';
import { OdsStringAttributes2Str } from '@ovhcloud/ods-testing';
import { OdsComponentAttributes2StringAttributes } from '@ovhcloud/ods-core';
import { MscBillingTile, IMscBillingTile } from '../src';

const defaultAttributes = {
  tileType: 'FAQ',
  tileTitle: 'FAQ title',
  tileDescription:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  href: 'https://ovh.com',
  seeMoreLabel: 'See more',
  dataTracking: 'home::dashboard::test',
};

export const badgesSlotExample = `
  <span slot="badges">
    <osds-chip color="primary" size="sm">OVHcloud</osds-chip>
    <osds-chip color="success" size="sm">Beta</osds-chip>
  </span>
`;

export const footerSlotExample = `
  <div slot="footer">
    <osds-button color="primary" style="margin-top: 1.5rem">Commander</osds-button>
  </div>
`;

export const setupSpecTest = async ({
  attributes = {},
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
  const badgesSlot = page.root?.shadowRoot?.querySelector(
    'slot[name="badges"]',
  );
  const footerSlot = page.root?.shadowRoot?.querySelector(
    'slot[name="footer"]',
  );
  const innerLink = page.root?.shadowRoot?.querySelector('osds-link');
  const wrapperLink = page.root?.shadowRoot?.querySelector(
    'a.msc-billing-tile-wrapper',
  );
  return { page, badgesSlot, footerSlot, innerLink, wrapperLink };
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
  const linkElement = await page.find('msc-billing-tile >>> a');

  return { page, el, linkElement };
};
