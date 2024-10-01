import { PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import * as NotificationsApi from '@/data/api/notifications';
import { useFetchHubNotifications } from '@/data/hooks/notifications/useNotifications';
import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { NotificationsList } from '@/types/notifications.type';

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useFetchHubNotifications', () => {
  it('returns capsule even if api returned no notifications', async () => {
    const notifications: ApiEnvelope<NotificationsList> = {
      data: {
        notifications: {
          data: [],
          status: 'OK',
        },
      },
      status: 'OK',
    };
    const getNotifications = vi
      .spyOn(NotificationsApi, 'getNotifications')
      .mockReturnValue(new Promise((resolve) => resolve(notifications)));

    const { result } = renderHook(() => useFetchHubNotifications(), {
      wrapper,
    });

    await waitFor(() => {
      expect(getNotifications).toHaveBeenCalled();
      expect(result.current.data).toEqual(notifications);
    });
  });
});
