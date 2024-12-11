import { describe, it, expect, vi } from 'vitest';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import queryClient from '@/queryClient';

vi.mock('react-i18next', async () => {
  const { ...rest } = await vi.importActual('react-i18next');
  return {
    ...rest,
    useTranslation: vi.fn().mockImplementation((namespace: string) => ({
      t: vi.fn().mockImplementation((key: string) => `${namespace} | ${key}`),
    })),
  };
});

vi.mock('@ovh-ux/manager-react-components', async () => ({
  useNotifications: vi.fn().mockReturnValue({
    addSuccess: vi.fn(),
    addError: vi.fn(),
    clearNotifications: vi.fn(),
  }),
}));

vi.mock('@/queryClient', async () => ({
  default: { invalidateQueries: vi.fn() },
}));

describe('Callbacks', () => {
  describe('create', () => {
    it('should call addSuccess, clearNotifications and invalidateCache on success', async () => {
      const { useCallbacks } = await import('./callbacks');
      const callbacks = useCallbacks();
      await callbacks.create.success();

      expect(useNotifications().clearNotifications).toHaveBeenCalled();
      expect(useNotifications().addSuccess).toHaveBeenLastCalledWith(
        'estimate | cpbea_estimate_alert_success',
        true,
      );

      expect(queryClient.invalidateQueries).toHaveBeenLastCalledWith({
        queryKey: ['project', 'project-id', 'alerting'],
      });
    });

    it('should call clearNotifications on failure', async () => {
      const { useCallbacks } = await import('./callbacks');
      const callbacks = useCallbacks();
      callbacks.create.failure();

      expect(useNotifications().addError).toHaveBeenLastCalledWith(
        'estimate | cpbea_estimate_alert_error',
        true,
      );
    });
  });

  describe('update', () => {
    it('should call addSuccess, clearNotifications and invalidateCache on success', async () => {
      const { useCallbacks } = await import('./callbacks');
      const callbacks = useCallbacks();
      await callbacks.update.success();

      expect(useNotifications().clearNotifications).toHaveBeenCalled();
      expect(useNotifications().addSuccess).toHaveBeenLastCalledWith(
        'estimate | cpbea_estimate_alert_success',
        true,
      );

      expect(queryClient.invalidateQueries).toHaveBeenLastCalledWith({
        queryKey: ['project', 'project-id', 'alerting'],
      });
    });

    it('should call clearNotifications on failure', async () => {
      const { useCallbacks } = await import('./callbacks');
      const callbacks = useCallbacks();
      callbacks.update.failure();

      expect(useNotifications().addError).toHaveBeenLastCalledWith(
        'estimate | cpbea_estimate_alert_error',
        true,
      );
    });
  });

  describe('remove', () => {
    it('should call addSuccess, clearNotifications and invalidateCache on success', async () => {
      const { useCallbacks } = await import('./callbacks');
      const callbacks = useCallbacks();
      await callbacks.remove.success();

      expect(useNotifications().clearNotifications).toHaveBeenCalled();
      expect(useNotifications().addSuccess).toHaveBeenLastCalledWith(
        'estimate | cpbe_estimate_alert_delete_success',
        true,
      );

      expect(queryClient.invalidateQueries).toHaveBeenLastCalledWith({
        queryKey: ['project', 'project-id', 'alerting'],
      });
    });

    it('should call clearNotifications on failure', async () => {
      const { useCallbacks } = await import('./callbacks');
      const callbacks = useCallbacks();

      const error = {} as ApiError;

      callbacks.remove.failure(error);

      expect(useNotifications().addError).toHaveBeenLastCalledWith(
        'estimate | cpbe_estimate_alert_delete_error ',
        true,
      );
    });
  });
});
