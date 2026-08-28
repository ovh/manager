import { useQuery } from '@tanstack/react-query';

import { getSupportConversations } from '@/data/api/apiSupportConversation';
import { SupportConversation } from '@/types/support.type';

export const supportConversationsQueryKey = ['get-support-conversations'];

export const useSupportConversations = ({ enabled }: { enabled: boolean }) =>
  useQuery<SupportConversation[]>({
    queryKey: supportConversationsQueryKey,
    queryFn: getSupportConversations,
    enabled,
  });
