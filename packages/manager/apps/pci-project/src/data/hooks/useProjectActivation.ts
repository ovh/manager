import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  simulateActivateDiscoveryProject,
  activateDiscoveryProject,
  claimVoucher,
  ProjectActivationResponse,
} from '@/data/api/project-activation';

export interface ActivateProjectParams {
  projectId?: string;
  voucherCode?: string;
  voucherAmount?: string;
  simulate?: boolean;
  autoPay?: boolean;
}

/**
 * Hook to simulate project activation and check if payment is required
 */
export const useSimulateProjectActivation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: ProjectActivationResponse) => void;
  onError?: (error: ApiError) => void;
} = {}) =>
  useMutation({
    mutationFn: (serviceId: number) =>
      simulateActivateDiscoveryProject(serviceId),
    onSuccess,
    onError,
  });

/**
 * Hook to activate a discovery project
 */
export const useActivateProject = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: ProjectActivationResponse) => void;
  onError?: (error: ApiError) => void;
} = {}) =>
  useMutation({
    mutationFn: (serviceId: number) => activateDiscoveryProject(serviceId),
    onSuccess,
    onError,
  });

export const useClaimVoucher = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
} = {}) =>
  useMutation<void, ApiError, { projectId: string; voucherCode: string }>({
    mutationFn: ({ projectId, voucherCode }) =>
      claimVoucher(projectId, voucherCode),
    onSuccess,
    onError,
  });
