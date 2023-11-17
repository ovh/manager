import {
  newSpecPage,
  newE2EPage,
  E2EElement,
  E2EPage,
} from '@stencil/core/testing';
import { OdsStringAttributes2Str } from '@ovhcloud/ods-common-testing';
import { MscNetworkTile, IMscNetworkTile } from '../src';

import { MscNetworkClipboard } from '../src/msc-network-tile/components/msc-network-clipboard';
import { MscNetworkDnsSecondary } from '../src/msc-network-tile/components/msc-network-dns-secondary';
import { MscNetworkLoadbalancer } from '../src/msc-network-tile/components/msc-network-loadbalancer';
import { MscNetworkOla } from '../src/msc-network-tile/components/msc-network-ola';
import { MscNetworkVrack } from '../src/msc-network-tile/components/msc-network-vrack';

import { config } from '../mock/handlers';
import {
  mockRequests,
  e2eMockResponseHandler,
} from '../../../_common/mock-helpers';

import tradFR from '../src/translations/Messages_fr_FR.json';
import tradEN from '../src/translations/Messages_en_GB.json';

const defaultAttributes = {
  serviceName: 'ns111111.ovh.net',
};

export const setupSpecTest = async (attributes?: Partial<IMscNetworkTile>) => {
  const mockV6 = mockRequests(config, 'v6');
  const mock2api = mockRequests(config, 'aapi');
  const stringAttributes = { ...defaultAttributes, ...attributes };
  const page = await newSpecPage({
    components: [
      MscNetworkTile,
      MscNetworkClipboard,
      MscNetworkDnsSecondary,
      MscNetworkLoadbalancer,
      MscNetworkOla,
      MscNetworkVrack,
    ],
    html: `<msc-network-tile ${OdsStringAttributes2Str(
      stringAttributes,
    )}></msc-network-tile>`,
  });

  const networkTile = page.root?.shadowRoot as ShadowRoot;

  const clipboardBlocks = Array.from(
    networkTile?.querySelectorAll('msc-network-clipboard') as NodeList,
  ).map((element) => {
    return (element as HTMLElement).shadowRoot;
  });

  const [title] = Array.from(
    networkTile.querySelectorAll('osds-text') as NodeList,
  );

  return {
    page,
    mockV6,
    mock2api,
    networkTile,
    title,
    clipboardBlocks,
    dnsSecondaryBlock: networkTile?.querySelector('msc-network-dns-secondary')
      ?.shadowRoot,

    olaBlock: networkTile?.querySelector('msc-network-ola')?.shadowRoot,
    vrackBlock: networkTile?.querySelector('msc-network-vrack')?.shadowRoot,
    loadbalancerBlock: networkTile?.querySelector('msc-network-loadbalancer')
      ?.shadowRoot,
    tradFR,
    tradEN,
  };
};

export const setupE2eTest = async (attributes?: Partial<IMscNetworkTile>) => {
  const stringAttributes = { ...defaultAttributes, ...attributes };

  const page: E2EPage = await newE2EPage({ timeout: 30000 });

  await page.setRequestInterception(true);

  page.on(
    'response',
    e2eMockResponseHandler({
      page,
      handlers: config,
      apiVersion: 'v6',
    }),
  );
  await page.setContent(
    `<msc-network-tile ${OdsStringAttributes2Str(
      stringAttributes,
    )}></msc-network-tile>`,
    { timeout: 30000 },
  );

  await page.waitForChanges();

  await page.evaluate(() => document.body.style.setProperty('margin', '0px'));

  await page.find('.msc-network-tile-wrapper');

  const el: E2EElement = await page.find('msc-network-tile');
  const networkTile = el.shadowRoot;
  const clipboardBlock = el.shadowRoot.querySelectorAll(
    'msc-network-clipboard',
  );
  const dnsSecondaryBlock = el.shadowRoot.querySelector(
    'msc-network-dns-secondary',
  );
  const loadbalancerBlock = el.shadowRoot.querySelector(
    'msc-network-loadbalancer',
  );
  const olaBlock = el.shadowRoot.querySelector('msc-network-ola');
  const vrackBlock = el.shadowRoot.querySelector('msc-network-vrack');
  return {
    page,
    el,
    networkTile,
    clipboardBlock,
    dnsSecondaryBlock,
    loadbalancerBlock,
    olaBlock,
    vrackBlock,
  };
};
