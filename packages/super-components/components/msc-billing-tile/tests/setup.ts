import {
  E2EElement,
  E2EPage,
  newSpecPage,
  newE2EPage,
} from '@stencil/core/testing';
import { OdsStringAttributes2Str } from '@ovhcloud/ods-testing';
import { OdsComponentAttributes2StringAttributes } from '@ovhcloud/ods-core';
import { MscBillingTile, IMscBillingTile } from '../src';
import { vpsResponseUnified } from './mockRequests';

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
}: {
  attributes?: Partial<IMscBillingTile>;
}) => {
  const stringAttributes = OdsComponentAttributes2StringAttributes<
    Partial<IMscBillingTile>
  >({ ...defaultAttributes, ...attributes }, defaultAttributes);
  const page = await newSpecPage({
    components: [MscBillingTile],
    html: `<msc-billing-tile ${OdsStringAttributes2Str(
      stringAttributes,
    )}></msc-billing-tile>`,
  });
  const htmlBillingTile:
    | HTMLElement
    | null
    | undefined = document.querySelector('msc-billing-tile') as HTMLElement;
  const instance = page.rootInstance;

  return { page, instance, htmlBillingTile };
};

export const setupE2eTest = async ({
  attributes = {
    dataTracking: 'home::dashboard::test',
    language: 'en-GB',
    servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
    offer: 'vps-0baa4fcf.vps.ovh.net',
  },
}: {
  attributes?: Partial<IMscBillingTile>;
}) => {
  const stringAttributes = OdsComponentAttributes2StringAttributes<
    Partial<IMscBillingTile>
  >({ ...defaultAttributes, ...attributes }, defaultAttributes);

  const page: E2EPage = await newE2EPage();

  await page.setRequestInterception(true);

  page.on('response', (response) => {
    if (response.url().includes(page.url())) {
      (page as any).removeAllListeners('request');
      page.on('request', (request) => {
        // you can mock responses here
        if (
          request.url().includes('vps/vps-0baa4fcf.vps.ovh.net/serviceInfos') ||
          request.url().includes('services/118977335')
        ) {
          request.respond({
            status: 200,
            body: JSON.stringify(vpsResponseUnified),
          });
        } else {
          request.continue();
        }
      });
    }
  });

  await page.setContent(
    `<msc-billing-tile ${OdsStringAttributes2Str(
      stringAttributes,
    )}></msc-billing-tile>`,
  );

  await page.evaluate(() => document.body.style.setProperty('margin', '0px'));

  const el: E2EElement = await page.find('msc-billing-tile');

  return { page, el };
};
