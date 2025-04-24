import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as sshkey from '@datatr-ux/ovhcloud-types/cloud/sshkey/index';
import { useParams } from 'react-router-dom';
import { AIError } from '@/data/api';
import { AddSSHKey, addSSHKey } from '@/data/api/sshkey/sshkey.api';

export interface UseAddSshKey {
  onError: (cause: AIError) => void;
  onAddKeySuccess: (sshKey: sshkey.SshKeyDetail) => void;
}
export function useAddSshKey({ onError, onAddKeySuccess }: UseAddSshKey) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (sshKey: AddSSHKey) => addSSHKey(sshKey),
    onError,
    onSuccess: (data: sshkey.SshKeyDetail) => {
      onAddKeySuccess(data);
      // Invalidate service list query to get the latest data
      queryClient.invalidateQueries({
        queryKey: [projectId, 'sshkey'],
      });
    },
  });

  return {
    addSSHKey: (sshKey: AddSSHKey) => {
      return mutation.mutate(sshKey);
    },
    ...mutation,
  };
}
