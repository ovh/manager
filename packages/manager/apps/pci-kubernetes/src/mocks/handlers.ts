import { http, HttpResponse } from 'msw';
import mockedModule from './mockAvaibility.json';

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
];
