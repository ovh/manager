import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { getIpGameFirewallQueryKey, putIpGameFirewall } from '@/data/api';

export type UpdateGameFirewallMutationParams = { firewallModeEnabled: boolean };

export type UseUpdateIpGameFirewallParams = {
  ip: string;
  ipOnGame: string;
  onError?: (apiError: ApiError) => void;
  onSuccess?: (variables: UpdateGameFirewallMutationParams) => void;
  onSettled?: () => void;
};

export const useUpdateIpGameFirewall = ({
  ip,
  ipOnGame,
  onError,
  onSuccess,
  onSettled,
}: UseUpdateIpGameFirewallParams) => {
  const queryClient = useQueryClient();
  const { clearNotifications } = useNotifications();

  return useMutation({
    mutationFn: ({ firewallModeEnabled }: UpdateGameFirewallMutationParams) =>
      putIpGameFirewall({
        ip,
        ipOnGame,
        firewallModeEnabled,
      }),
    onSuccess: async (_, variables) => {
      clearNotifications();
      await queryClient.invalidateQueries({
        queryKey: getIpGameFirewallQueryKey({ ip }),
      });
      onSuccess?.(variables);
    },
    onError: (error: ApiError) => {
      clearNotifications();
      onError?.(error);
    },
    onSettled,
  });
};
