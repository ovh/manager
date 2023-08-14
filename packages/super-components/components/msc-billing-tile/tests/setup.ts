import {
  E2EElement,
  E2EPage,
  newSpecPage,
  newE2EPage,
  mockFetch,
} from '@stencil/core/testing';
import { OdsStringAttributes2Str } from '@ovhcloud/ods-testing';
import { OdsComponentAttributes2StringAttributes } from '@ovhcloud/ods-core';
import MockAdapter from 'axios-mock-adapter';
import apiClient from '@ovh-ux/manager-core-api';
import { MscBillingTile, IMscBillingTile } from '../src';
import { MscBillingCommitment } from '../src/msc-billing-tile/msc-billing-commitment';
import { MscBillingContact } from '../src/msc-billing-tile/msc-billing-contact';
import { MscBillingOffer } from '../src/msc-billing-tile/msc-billing-offer';
import { MscBillingRenewal } from '../src/msc-billing-tile/msc-billing-renewal';
import { config } from '../mock/handlers';

import tradFR from '../src/translations/Messages_fr_FR.json';
import tradEN from '../src/translations/Messages_en_GB.json';

const defaultAttributes = {
  servicePath: 'dedicated/nasha/zpool-111111',
  language: 'fr-FR',
};

export const setupSpecTest = async (attributes?: Partial<IMscBillingTile>) => {
  mockFetch.json(tradFR, '/translations/Messages_fr_FR.json');
  mockFetch.json(tradEN, '/translations/Messages_en_GB.json');
  const mock = new MockAdapter(apiClient.v6);
  config.forEach(({ url, method = 'get', status = 200, response }) => {
    const mockMethod = `on${method[0].toUpperCase()}${method?.substring(1)}`;
    const mockUrl = url.includes(':id')
      ? new RegExp(url.replace(':id', '*'))
      : url;
    mock[mockMethod](mockUrl).reply(status, response);
  });

  const stringAttributes = OdsComponentAttributes2StringAttributes<
    Partial<IMscBillingTile>
  >({ ...defaultAttributes, ...attributes }, defaultAttributes);
  const page = await newSpecPage({
    components: [
      MscBillingTile,
      MscBillingCommitment,
      MscBillingContact,
      MscBillingOffer,
      MscBillingRenewal,
    ],
    html: `<msc-billing-tile ${OdsStringAttributes2Str(
      stringAttributes,
    )}></msc-billing-tile>`,
  });
  const billingTile = page.root?.shadowRoot as ShadowRoot;

  const [title, creationDateTitle, creationDate] = Array.from(
    billingTile.querySelectorAll('osds-text') as NodeList,
  );

  return {
    page,
    mock,
    billingTile,
    title,
    creationDateTitle,
    creationDate,
    commitmentBlock: page.root?.shadowRoot?.querySelector(
      'msc-billing-commitment',
    )?.shadowRoot,
    contactBlock: page.root?.shadowRoot?.querySelector('msc-billing-contact')
      ?.shadowRoot,
    offerBlock: page.root?.shadowRoot?.querySelector('msc-billing-offer')
      ?.shadowRoot,
    renewalBlock: page.root?.shadowRoot?.querySelector('msc-billing-renewal')
      ?.shadowRoot,
    tradFR,
    tradEN,
  };
};

export const setupE2eTest = async (attributes?: Partial<IMscBillingTile>) => {
  const stringAttributes = OdsComponentAttributes2StringAttributes<
    Partial<IMscBillingTile>
  >({ ...defaultAttributes, ...attributes }, defaultAttributes);

  const page: E2EPage = await newE2EPage({ timeout: 30000 });

  await page.setRequestInterception(true);

  page.on('response', (res) => {
    if (res.url().includes('localhost')) {
      (page as any).removeAllListeners('request');
      page.on('request', (request) => {
        const response = config.find(({ url }) => {
          const urlToMatch = url.includes(':id')
            ? new RegExp(
                `^${page.url()}${apiClient.v6
                  .getUri()
                  .substring(1)}/${url.replace(':id', '\\d+')}$`,
              )
            : `^${page.url()}${apiClient.v6.getUri().substring(1)}/${url}$`;

          return request.url().match(urlToMatch);
        });

        if (response) {
          return request.respond({
            status: response.status ?? 200,
            contentType: 'application/json',
            body: JSON.stringify(response.response),
          });
        }
        if (request.url().includes('/translations/Messages_fr_FR.json')) {
          return request.respond({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(tradFR),
          });
        }
        if (request.url().includes('/translations/Messages_en_GB.json')) {
          return request.respond({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(tradFR),
          });
        }
        return request.continue();
      });
    }
  });

  await page.setContent(
    `<msc-billing-tile ${OdsStringAttributes2Str(
      stringAttributes,
    )}></msc-billing-tile>`,
  );

  await page.waitForChanges();

  await page.evaluate(() => document.body.style.setProperty('margin', '0px'));

  await page.find('.msc-billing-tile-wrapper');
  const el: E2EElement = await page.find('msc-billing-tile');

  const billingTile = el.shadowRoot;
  const commitmentBlock = el.shadowRoot.querySelector('msc-billing-commitment');
  const offerBlock = el.shadowRoot.querySelector('msc-billing-offer');
  const contactBlock = el.shadowRoot.querySelector('msc-billing-contact');
  const renewalBlock = el.shadowRoot.querySelector('msc-billing-renewal');

  return {
    page,
    el,
    billingTile,
    commitmentBlock,
    offerBlock,
    contactBlock,
    renewalBlock,
  };
};
