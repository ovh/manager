import React from 'react';
import { vi } from 'vitest';
import { waitFor, screen, render } from '@testing-library/react';
import { SetupServer, setupServer } from 'msw/node';
import { toMswHandlers } from '@ovh-ux/manager-core-test-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTask, UseTaskParams } from './useTask';
import '@testing-library/jest-dom';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

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

const setupTest = ({
  apiVersion,
  status,
}: {
  apiVersion: 'v2' | 'v6';
  status: 'RUNNING' | 'DONE' | 'ERROR';
}) => {
  server = setupServer(
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

  const onSuccess = vi.fn();
  const onError = vi.fn();
  const onFinish = vi.fn();

  const result = render(
    <QueryClientProvider client={queryClient}>
      <Example
        apiVersion={apiVersion}
        taskId={taskId}
        onSuccess={onSuccess}
        onError={onError}
        onFinish={onFinish}
      />
    </QueryClientProvider>,
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
      const { onError, onFinish, onSuccess } = setupTest({
        apiVersion: 'v6',
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

    it('is successful if the task returns a 404', async () => {
      const { onError, onFinish, onSuccess } = setupTest({
        apiVersion: 'v6',
        status: 'DONE',
      });
      await waitFor(
        () => expect(screen.getByText(successMessage)).toBeVisible(),
        { timeout: 5000 },
      );
      expect(onFinish).toHaveBeenCalledTimes(1);
      expect(onError).not.toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('is in error if the task returns a 500', async () => {
      const { onError, onFinish, onSuccess } = setupTest({
        apiVersion: 'v6',
        status: 'ERROR',
      });
      await waitFor(
        () => expect(screen.getByText(errorMessage)).toBeVisible(),
        { timeout: 5000 },
      );
      expect(onFinish).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe('API v2 tasks', () => {
    it('is pending while the task has a RUNNING status', async () => {
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
      const { onError, onFinish, onSuccess } = setupTest({
        apiVersion: 'v2',
        status: 'DONE',
      });
      await waitFor(
        () => expect(screen.getByText(successMessage)).toBeVisible(),
        { timeout: 5000 },
      );
      expect(onFinish).toHaveBeenCalledTimes(1);
      expect(onError).not.toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('is in error if the task has an ERROR status', async () => {
      const { onError, onFinish, onSuccess } = setupTest({
        apiVersion: 'v2',
        status: 'ERROR',
      });
      await waitFor(
        () => expect(screen.getByText(errorMessage)).toBeVisible(),
        { timeout: 5000 },
      );
      expect(onFinish).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
