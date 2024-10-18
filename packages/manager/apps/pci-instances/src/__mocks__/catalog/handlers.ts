import { http, HttpResponse, JsonBodyType, RequestHandler } from 'msw';

export const catalogHandlers = <T extends JsonBodyType>(
  mockedResponsePayload?: T,
): RequestHandler[] => [
  http.get('*/cloud/project/:projectId/catalog/instance', async () => {
    return !mockedResponsePayload
      ? new HttpResponse(null, { status: 500 })
      : HttpResponse.json(mockedResponsePayload);
  }),
];
