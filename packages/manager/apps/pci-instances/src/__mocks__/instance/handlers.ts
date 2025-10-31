import { http, HttpResponse, JsonBodyType, RequestHandler } from 'msw';
import { DeepReadonly } from '@/types/utils.type';

export type TInstancesServerResponse = DeepReadonly<{
  method: 'get' | 'delete' | 'post';
  payload: JsonBodyType;
}>;

const rootUri = '*/cloud/project/:projectId';

const getResponsePayload = (payload: JsonBodyType) =>
  payload === undefined
    ? new HttpResponse(null, { status: 500 })
    : HttpResponse.json(payload);

const getResponseEndpoint = (
  method: TInstancesServerResponse['method'],
): string => {
  switch (method) {
    case 'get':
      return `${rootUri}/aggregated/instance`;
    case 'delete':
      return `${rootUri}/instance/:instanceId`;
    case 'post':
      return `${rootUri}/instance/:instanceId/*`;
    default:
      return '';
  }
};

export const instancesHandlers = (
  response: TInstancesServerResponse[],
): RequestHandler[] =>
  response.map(({ method, payload }) =>
    http[method](getResponseEndpoint(method), () =>
      getResponsePayload(payload),
    ),
  );
