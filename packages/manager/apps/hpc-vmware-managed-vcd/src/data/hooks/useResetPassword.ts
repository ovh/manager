import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { resetOrganizationPassword } from '../api/hpc-vmware-managed-vcd-reset-password';
import { getVcdOrganizationResetPasswordQueryKey } from '@/utils/queryKeys';

export const useResetPassword = (
  { id }: { id: string },
  options?: Partial<
    UseMutationOptions<ApiResponse<unknown>, ApiError, void, unknown>
  >,
) =>
  useMutation({
    mutationKey: getVcdOrganizationResetPasswordQueryKey(id),
    mutationFn: () => resetOrganizationPassword(id),
    ...options,
  });
