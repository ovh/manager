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
];
