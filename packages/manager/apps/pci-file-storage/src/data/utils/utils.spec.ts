/* eslint-disable max-nested-callbacks */
import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect } from 'vitest';

import { ApiError } from '@ovh-ux/manager-core-api';

import { isApiErrorResponse } from './index';

const fakeHeaders = new AxiosHeaders();

describe('Utility functions', () => {
  describe('isApiErrorResponse', () => {
    const apiError: ApiError = new AxiosError(undefined, undefined, undefined, undefined, {
      status: 404,
      data: { message: '' },
      statusText: '',
      config: { headers: fakeHeaders },
      headers: fakeHeaders,
    });

    describe.each`
      input                | expectedOutput
      ${null}              | ${false}
      ${undefined}         | ${false}
      ${new Error('test')} | ${false}
      ${apiError}          | ${true}
      ${'test'}            | ${false}
    `(
      'Given the input <$input>',
      ({ input, expectedOutput }: { input: unknown; expectedOutput: boolean }) => {
        test(`Then, expect result to be '${expectedOutput}'`, () => {
          expect(isApiErrorResponse(input)).toStrictEqual(expectedOutput);
        });
      },
    );
  });
});
