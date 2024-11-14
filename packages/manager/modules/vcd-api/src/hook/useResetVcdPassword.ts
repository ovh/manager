import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { getVcdOrganizationResetPasswordQueryKey } from '../utils';
import { resetOrganizationPassword } from '../api';

export const useResetVcdPassword = (
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
