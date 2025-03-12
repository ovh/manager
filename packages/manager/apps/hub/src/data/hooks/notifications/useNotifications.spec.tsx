import { PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import { aapi as Api } from '@ovh-ux/manager-core-api';
import { useFetchHubNotifications } from '@/data/hooks/notifications/useNotifications';
import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { NotificationsList } from '@/types/notifications.type';

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
vi.mock('i18next', () => ({
  default: {
    language: 'fr_FR',
  },
}));

describe('useFetchHubNotifications', () => {
  it('should return notifications after extracting them from api envelope', async () => {
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
      .spyOn(Api, 'get')
      .mockReturnValue(Promise.resolve(notifications));

    const { result } = renderHook(() => useFetchHubNotifications(), {
      wrapper,
    });

    await waitFor(() => {
      expect(getNotifications).toHaveBeenCalled();
      expect(result.current.data).toEqual(
        notifications.data.notifications.data,
      );
    });
  });
});
