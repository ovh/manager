import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, test } from 'vitest';
import { ErrorBannerProps } from '@ovhcloud/manager-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { mapUnknownErrorToBannerError } from './index';

describe('Utility functions', () => {
  describe('Considering the mapUnknownErrorToBannerError function', () => {
    type Data = {
      rawError: unknown;
      expectedOutputError: ErrorBannerProps['error'];
    };
    const fakeRequest = { path: '/foo' };
    const fakeHeaders = new AxiosHeaders();
    const fakeConfig = {
      url: 'https://foo.bar',
      headers: fakeHeaders,
    };

    const fakeApiError1 = (new AxiosError(
      'Message 1',
      'Code 1',
      fakeConfig,
      fakeRequest,
      {
        status: 404,
        data: { foo: 'bar' },
        statusText: '',
        config: fakeConfig,
        headers: fakeHeaders,
      },
    ) as unknown) as ApiError;

    const fakeApiError2 = new AxiosError(
      'Message 2',
      'Code 2',
      fakeConfig,
      fakeRequest,
      {
        status: 404,
        data: { message: 'Resource not found' },
        statusText: '',
        config: fakeConfig,
        headers: fakeHeaders,
      },
    ) as ApiError;

    const fakeApiError3 = new AxiosError(
      'Message 2',
      'Code 2',
      fakeConfig,
      fakeRequest,
    ) as ApiError;

    const fakeRouterError1 = {
      status: 404,
      statusText: '',
      data: {
        message: 'Resource not found',
      },
      internal: true,
    };

    const fakeRouterError2 = {
      status: 404,
      data: {
        message: 'Resource not found',
      },
    };

    describe.each`
      rawError            | expectedOutputError
      ${{}}               | ${{}}
      ${null}             | ${{}}
      ${undefined}        | ${{}}
      ${fakeApiError1}    | ${{}}
      ${fakeApiError2}    | ${{ status: 404, data: { message: 'Resource not found' }, headers: fakeHeaders }}
      ${fakeApiError3}    | ${{}}
      ${fakeRouterError1} | ${{ data: { message: 'Resource not found' }, status: 404 }}
      ${fakeRouterError2} | ${{}}
    `(
      'Given an error <$rawError> thrown through a route',
      ({ rawError, expectedOutputError }: Data) => {
        describe('When calling mapUnknownErrorToBannerError()', () => {
          test(`Then, expect the output error to be '${JSON.stringify(
            expectedOutputError,
          )}'`, () => {
            expect(mapUnknownErrorToBannerError(rawError)).toStrictEqual(
              expectedOutputError,
            );
          });
        });
      },
    );
  });
});
