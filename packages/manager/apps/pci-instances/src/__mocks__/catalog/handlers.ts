import { http, HttpResponse, JsonBodyType, RequestHandler, delay } from 'msw';
import mockedCatalog from './fullCatalogGenerated.json';

export const catalogHandlers = <T extends JsonBodyType>(
  mockedResponsePayload?: T,
): RequestHandler[] => [
  http.get('*/cloud/project/:projectId/catalog/instance', async () => {
    return !mockedResponsePayload
      ? new HttpResponse(null, { status: 500 })
      : HttpResponse.json(mockedResponsePayload);
  }),
];

export const browserHandlers: RequestHandler[] = [
  http.get('*/cloud/project/:projectId/catalog/instance', async () => {
    await delay(2000);
    return HttpResponse.json(mockedCatalog);
  }),
];
