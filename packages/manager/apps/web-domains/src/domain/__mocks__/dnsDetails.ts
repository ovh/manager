import { TDatagridDnsDetails } from '../types/domainResource';

export const dnsDatagridMockError: TDatagridDnsDetails[] = [
  {
    name: 'ns103.ovh.net',
    ip: '192.0.2.1',
    status: 'ENABLED',
    type: 'HOSTING',
  },
  {
    name: 'ns999.ovh.net',
    ip: '-',
    status: 'ERROR',
    type: 'STANDARD',
  },
  {
    name: 'dns101.ovh.net',
    ip: '-',
    status: 'ACTIVATING',
    type: 'STANDARD',
  },
  {
    name: 'dns103.ovh.net',
    ip: '192.0.2.2',
    status: 'ACTIVATING',
    type: 'STANDARD',
  },
];

export const dnsDatagridMock: TDatagridDnsDetails[] = [
  {
    name: 'ns103.ovh.net',
    ip: '192.0.2.1',
    status: 'ENABLED',
    type: 'HOSTING',
  },
  {
    name: 'dns101.ovh.net',
    ip: '-',
    status: 'ACTIVATING',
    type: 'STANDARD',
  },
  {
    name: 'dns103.ovh.net',
    ip: '192.0.2.2',
    status: 'ACTIVATING',
    type: 'STANDARD',
  },
  {
    name: 'ns999.ovh.net',
    ip: '-',
    status: 'DELETING',
    type: 'STANDARD',
  },
];
