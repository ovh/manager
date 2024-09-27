/* eslint-disable @typescript-eslint/ban-ts-comment */
import { waitFor, screen } from '@testing-library/react';
import { SetupServer, setupServer } from 'msw/node';
import { useTask, UseTaskParams } from './useTask';
import { render } from '../../../utils/test.provider';
import { toMswHandlers } from '../../../../../../playwright-helpers/msw';
import '@testing-library/jest-dom';
import { useQuery } from '@tanstack/react-query';

let server: SetupServer;

const taskId = '1234';
const errorMessage = 'error';
const successMessage = 'success';
const pendingMessage = 'pending';

const Example = (props: Partial<UseTaskParams>) => {
  const { isError, isPending, isSuccess } = useTask({
    ...props,
    resourceUrl: '/example',
    refetchIntervalTime: 10,
  });

  return (
    <>
      {isError && <div>{errorMessage}</div>}
      {isSuccess && <div>{successMessage}</div>}
      {isPending && <div>{pendingMessage}</div>}
    </>
  );
};

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));

jest.mock('./useTask', () => ({
  useTask: jest.fn(),
}));

const setupTest = ({
  apiVersion,
  status,
}: {
  apiVersion: 'v2' | 'v6';
  status: 'RUNNING' | 'DONE' | 'ERROR';
}) => {
  server = setupServer(
    // @ts-ignore
    ...toMswHandlers([
      {
        api: 'v2',
        url: `/example/task/${taskId}`,
        response: {
          status: 'RUNNING',
        },
        status: 200,
        once: true,
      },
      {
        api: 'v2',
        url: `/example/task/${taskId}`,
        response: {
          status,
        },
        status: 200,
      },
      {
        api: 'v6',
        url: `/example/task/${taskId}`,
        response:
          status === 'ERROR'
            ? {
                message: errorMessage,
              }
            : {},
        status: 200,
        once: true,
      },
      {
        api: 'v6',
        url: `/example/task/${taskId}`,
        response:
          status === 'ERROR'
            ? {
                message: errorMessage,
              }
            : {},
        status: (() => {
          if (status === 'RUNNING') {
            return 200;
          }
          return status === 'ERROR' ? 500 : 404;
        })(),
      },
    ]),
  );
  server.listen({ onUnhandledRequest: 'warn' });

  const onSuccess = jest.fn();
  const onError = jest.fn();
  const onFinish = jest.fn();

  const result = render(
    <Example
      apiVersion={apiVersion}
      taskId={taskId}
      onSuccess={onSuccess}
      onError={onError}
      onFinish={onFinish}
    />,
  );

  return {
    ...result,
    onSuccess,
    onError,
    onFinish,
  };
};

describe('useTask', () => {
  afterEach(() => {
    server?.close();
  });

  describe('API v6 tasks', () => {
    it('is pending while the task returns a 200 response', async () => {
      // @ts-ignore
      useQuery.mockReturnValue({
        isPending: true,
      });
      // @ts-ignore
      useTask.mockReturnValue({
        api: 'v6',
        url: `/example/task/${taskId}`,
        response: {},
        status: 'DONE',
        isPending: true,
      });
      const { onError, onFinish, onSuccess } = setupTest({
        apiVersion: 'v6',
        status: 'RUNNING',
      });

      expect(screen.getByText(pendingMessage)).toBeVisible();
      expect(onFinish).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('is successful if the task returns a 404', async () => {
      // @ts-ignore
      useQuery.mockReturnValue({
        isSuccess: true,
      });
      // @ts-ignore
      useTask.mockReturnValue({
        api: 'v6',
        url: `/example/task/${taskId}`,
        response: {
          message: successMessage,
          status: 'DONE',
        },
        isSuccess: true,
      });
      const { onError } = setupTest({
        apiVersion: 'v6',
        status: 'DONE',
      });

      expect(screen.getByText(successMessage)).toBeVisible();
      expect(onError).not.toHaveBeenCalled();
    });

    it('is in error if the task returns a 500', async () => {
      // @ts-ignore
      useQuery.mockReturnValue({
        isError: true,
      });
      // @ts-ignore
      useTask.mockReturnValue({
        api: 'v6',
        url: `/example/task/${taskId}`,
        response: {
          message: errorMessage,
          status: 'ERROR',
        },
        isError: true,
      });

      const { onSuccess } = setupTest({
        apiVersion: 'v6',
        status: 'ERROR',
      });

      await waitFor(
        () => expect(screen.getByText(errorMessage)).toBeVisible(),
        { timeout: 5000 },
      );
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe('API v2 tasks', () => {
    it('is pending while the task has a RUNNING status', async () => {
      // @ts-ignore
      useQuery.mockReturnValue({
        isPending: true,
      });
      // @ts-ignore
      useTask.mockReturnValue({
        api: 'v2',
        url: `/example/task/${taskId}`,
        response: {
          message: pendingMessage,
          status: 'Running',
        },
        isPending: true,
      });
      const { onError, onFinish, onSuccess } = setupTest({
        apiVersion: 'v2',
        status: 'RUNNING',
      });

      await waitFor(
        () => expect(screen.getByText(pendingMessage)).toBeVisible(),
        { timeout: 5000 },
      );
      expect(onFinish).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('is successful if the task has a DONE status', async () => {
      // @ts-ignore
      useQuery.mockReturnValue({
        isSuccess: true,
      });
      // @ts-ignore
      useTask.mockReturnValue({
        api: 'v2',
        url: `/example/task/${taskId}`,
        response: {
          message: successMessage,
          status: 'DONE',
        },
        isSuccess: true,
      });
      const { onError } = setupTest({
        apiVersion: 'v2',
        status: 'DONE',
      });

      await waitFor(
        () => expect(screen.getByText(successMessage)).toBeVisible(),
        { timeout: 5000 },
      );
      expect(onError).not.toHaveBeenCalled();
    });

    it('is in error if the task has an ERROR status', async () => {
      // @ts-ignore
      useQuery.mockReturnValue({
        isError: true,
      });
      // @ts-ignore
      useTask.mockReturnValue({
        api: 'v2',
        url: `/example/task/${taskId}`,
        response: {
          message: errorMessage,
          status: 'ERROR',
        },
        isError: true,
      });
      const { onSuccess } = setupTest({
        apiVersion: 'v2',
        status: 'ERROR',
      });

      await waitFor(
        () => expect(screen.getByText(errorMessage)).toBeVisible(),
        { timeout: 5000 },
      );
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
