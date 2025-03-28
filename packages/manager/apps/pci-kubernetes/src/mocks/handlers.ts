import { http, HttpResponse } from 'msw';
import mockedModule from './mockAvaibility.json';
import mockedPrivateNetwork from './mockPrivate.json';

export const handlers = [
  http.get(
    '/engine/apiv6/cloud/project/:projectId/capabilities/productAvailability',
    () =>
      HttpResponse.json({
        isPending: false,
        plans: [],
        products: [
          {
            name: 'kubernetes',
            regions: mockedModule,
          },
        ],
      }),
  ),
  http.get('/engine/apiv6/cloud/project/:projectId/network/private', () =>
    HttpResponse.json(mockedPrivateNetwork),
  ),
  http.get(
    '/engine/apiv6/cloud/project/:projectId/region/:region/network/:networkId/subnet',
    () =>
      HttpResponse.json([
        {
          id: '6f66426b-6ba6-425a-af8c-254a3b3c5418',
          cidr: '10.0.0.0/16',
          name: 'EU-WEST-PAR',
          gatewayIp: '10.0.0.1',
          ipVersion: 4,
          hostRoutes: [],
          dhcpEnabled: true,
          dnsNameServers: ['213.186.33.99'],
          allocationPools: [
            {
              end: '10.0.255.254',
              start: '10.0.0.2',
            },
          ],
        },
      ]),
  ),
];
