import { createBillingTile } from './create-billing-tile';
import {
  vpsResponseUnified,
  domainResponseUnified,
} from '../tests/mockRequests';
import * as TradFR from '../src/translations/Messages_fr_FR.json';
import * as TradEN from '../src/translations/Messages_en_GB.json';

const mockData = [
  {
    url: '/translations/Messages_fr_FR.json',
    method: 'GET',
    status: 200,
    response: TradFR,
  },
  {
    url: '/translations/Messages_en_GB.json',
    method: 'GET',
    status: 200,
    response: TradEN,
  },
  {
    url: '/engine/apiv6/vps/vps-0baa4fcf.vps.ovh.net/serviceInfos',
    method: 'GET',
    status: 200,
    response: vpsResponseUnified,
  },
  {
    url: '/engine/apiv6/services/118977335',
    method: 'GET',
    status: 200,
    response: vpsResponseUnified,
  },
  {
    url: '/engine/apiv6/domain/agora3.ovh/serviceInfos',
    method: 'GET',
    status: 200,
    response: domainResponseUnified,
  },
  {
    url: '/engine/apiv6/services/29162449',
    method: 'GET',
    status: 200,
    response: domainResponseUnified,
  },
  {
    url: '/engine/apiv6/domain/agora3.ovh',
    method: 'GET',
    status: 200,
    response: domainResponseUnified,
  },
];

const defaultLabels = {
  dataTracking: 'home::dashboard::test',
  servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
  offer: 'vps-0baa4fcf.vps.ovh.net',
};

export default {
  title: 'Components/Manager Billing Tile',
  tags: ['autodocs'],
  render: ({ tileNumber = 1, ...args }) => `
    <section style="display: grid; grid-gap: 30px; grid-template-columns: repeat(3, 1fr);">
      ${[...new Array(tileNumber)]
        .map(() => createBillingTile(args))
        .join('\n')}
    </section>
  `,
  argTypes: {
    language: { control: 'text', default: 'fr-FR' },
    offer: { control: 'text', default: 'vps-0baa4fcf.vps.ovh.net' },
    servicePath: { control: 'text', default: 'vps/vps-0baa4fcf.vps.ovh.net' },
    dataTracking: { control: 'text', default: 'home::dashboard::test' },
  },
  parameters: {
    mockData,
  },
};

export const VPS = {
  args: {
    dataTracking: 'home::dashboard::test',
    servicePath: 'vps/vps-0baa4fcf.vps.ovh.net',
    offer: 'vps-0baa4fcf.vps.ovh.net',
    language: 'en-GB',
  },
};

export const Domain = {
  args: {
    dataTracking: 'home::dashboard::test',
    servicePath: 'domain/agora3.ovh',
    offer: 'agora3.ovh',
    language: 'en-GB',
  },
};
