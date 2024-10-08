import { http, HttpResponse, JsonBodyType, RequestHandler } from 'msw';
import mockedCatalog3 from '@/__mocks__/catalog/catalogGenerated3.json';

export const regionHandlers = <T extends JsonBodyType>(
  mockedResponsePayload?: T,
): RequestHandler[] => [
  http.post('*/cloud/project/:projectId/region', async () => {
    return !mockedResponsePayload
      ? new HttpResponse(null, { status: 500 })
      : HttpResponse.json(mockedResponsePayload);
  }),
  http.get('*/cloud/project/:projectId/catalog/instance', async () => {
    return HttpResponse.json(mockedCatalog3);
  }),
];
