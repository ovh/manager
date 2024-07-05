import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { USER_INACTIVITY_TIMEOUT } from '@/configuration/polling.constants';
import { UserActivityProvider } from '@/contexts/UserActivityContext';

const queryClient = new QueryClient();
export const QueryClientWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <QueryClientProvider client={queryClient}>
    <UserActivityProvider timeout={USER_INACTIVITY_TIMEOUT}>
      {children}
    </UserActivityProvider>
  </QueryClientProvider>
);
