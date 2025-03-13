import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, test } from 'vitest';
import { ErrorBannerProps } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  instancesQueryKey,
  mapUnknownErrorToBannerError,
  kebabToSnakeCase,
  formatUUID,
} from './index';

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

  describe('Considering the kebabToSnakeCase function', () => {
    describe.each`
      input                   | expectedOutput
      ${'soft-reboot'}        | ${'soft_reboot'}
      ${'soft-reboot-action'} | ${'soft_reboot_action'}
    `('Given an input <$input>', ({ input, expectedOutput }) => {
      test(`Then, expect the output to be '${expectedOutput}'`, () => {
        expect(kebabToSnakeCase(input)).toStrictEqual(expectedOutput);
      });
    });
  });

  describe('Considering the formatUUID function', () => {
    describe.each`
      uuid                                      | expectedFormattedUuid
      ${''}                                     | ${null}
      ${'550e8400e29b41d4a71644'}               | ${null}
      ${'foo-bar'}                              | ${null}
      ${'550e8400e29b41d4a71644665544ZZZZ'}     | ${null}
      ${'550e8400-e29b-41d4-a716-446655440000'} | ${null}
      ${'550e8400e29b41d4a716446655440000'}     | ${'550e8400-e29b-41d4-a716-446655440000'}
    `('Given an uuid <$uuid>', ({ uuid, expectedFormattedUuid }) => {
      test(`Then, expect the output to be '${expectedFormattedUuid}'`, () => {
        expect(formatUUID(uuid)).toStrictEqual(expectedFormattedUuid);
      });
    });
  });
});
