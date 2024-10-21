import { useMutation } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import { AddSSHKey, addSSHKey } from '@/data/api/sshkey/sshkey.api';
import * as sshkey from '@/types/cloud/sshkey';

export interface UseAddSshKey {
  onError: (cause: AIError) => void;
  onSuccess: (sshKey: sshkey.SshKeyDetail) => void;
}
export function useAddSshKey({ onError, onSuccess }: UseAddSshKey) {
  const mutation = useMutation({
    mutationFn: (sshKey: AddSSHKey) => {
      return addSSHKey(sshKey);
    },
    onError,
    onSuccess,
  });

  return {
    addSSHKey: (sshKey: AddSSHKey) => {
      return mutation.mutate(sshKey);
    },
    ...mutation,
  };
}
