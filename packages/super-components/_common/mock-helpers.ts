import { apiClient } from '@ovh-ux/manager-core-api';
import MockAdapter from 'axios-mock-adapter';
import { Handler } from './msw-helpers';

const createUrlRe = (url: string) => url.replace('*', '.*').replace(':id', '*');

export const mockRequests = (handlers: Handler[]) => {
  const mock = new MockAdapter(apiClient.v6);
  handlers.forEach(({ url, method = 'get', status = 200, response }) => {
    const mockMethod = `on${method[0].toUpperCase()}${method?.substring(1)}`;
    const mockUrl =
      url.includes('*') || url.includes(':')
        ? new RegExp(createUrlRe(url))
        : url;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mock[mockMethod](mockUrl).reply(status, response);
  });
  return mock;
};

export const e2eMockResponseHandler = ({
  page,
  handlers,
}: {
  page: any;
  handlers: Handler[];
}) => (res: any) => {
  if (res.url().includes('localhost')) {
    page.removeAllListeners('request');
    page.on('request', (request: any) => {
      const response = handlers.find(({ url }) => {
        const urlToMatch = url.includes('*')
          ? new RegExp(
              `^${page.url()}${apiClient.v6
                .getUri()
                .substring(1)}/${createUrlRe(url)}$`,
            )
          : `^${page.url()}${apiClient.v6.getUri().substring(1)}/${url}$`;

        return request.url().match(urlToMatch);
      });

      if (response) {
        return request.respond({
          status: response.status ?? 200,
          contentType: 'application/json',
          body: JSON.stringify(response.response),
        });
      }
      return request.continue();
    });
  }
};
