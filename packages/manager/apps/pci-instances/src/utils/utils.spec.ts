import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, test } from 'vitest';
import { ErrorBannerProps } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { instancesQueryKey, mapUnknownErrorToBannerError } from './index';

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
  describe('Considering the instancesQueryKey function', () => {
    type Data = {
      projectId: string;
      rest?: string[];
      expectedQueryKey?: string[];
    };

    const fakeProjectId = '5a6980507a0a40dca362eb9b22d79049';
    const expectedQueryKey1 = ['project', fakeProjectId, 'instances'];

    const expectedRestParameters = ['test', 'id', '23'];
    const expectedQueryKey2 = [...expectedQueryKey1, ...expectedRestParameters];

    describe.each`
      projectId        | rest                      | expectedQueryKey
      ${fakeProjectId} | ${[]}                     | ${expectedQueryKey1}
      ${fakeProjectId} | ${[]}                     | ${expectedQueryKey1}
      ${fakeProjectId} | ${expectedRestParameters} | ${expectedQueryKey2}
    `(
      'Given a projectId <$projectId> and optional rest parameters <$rest>',
      ({ projectId, rest, expectedQueryKey }: Data) => {
        describe('When calling instancesQueryKey()', () => {
          test(`Then, expect the output queryKey to be '${JSON.stringify(
            expectedQueryKey,
          )}'`, () => {
            expect(instancesQueryKey(projectId, rest)).toStrictEqual(
              expectedQueryKey,
            );
          });
        });
      },
    );
  });
});
