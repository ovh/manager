import { http, HttpResponse, JsonBodyType, RequestHandler } from 'msw';

export const instancesHandlers = <T extends JsonBodyType>(
  mockedResponsePayload?: T,
): RequestHandler[] => [
  http.get('*/cloud/project/:projectId/aggregated/instance', async () => {
    return !mockedResponsePayload
      ? new HttpResponse(null, { status: 500 })
      : HttpResponse.json(mockedResponsePayload);
  }),
];
