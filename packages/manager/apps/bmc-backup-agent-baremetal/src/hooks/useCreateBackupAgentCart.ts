import { useContext } from 'react';

import { useMutation } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';
import { CreateCartResult, createCart } from '@ovh-ux/manager-module-order';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export type CreateBackupAgentCartParams = {
  ovhSubsidiary: string;
  agentIp: string;
  agentRegionName: string;
  agentServiceName: string;
};

/**
 * Creates a cart for Backup Agent with the following structure:
 * - Main product: backup-tenant (backupServices)
 * - Options:
 *   - backup-vault-paygo (with agent configurations)
 *   - vspc-tenant
 */
const createBackupAgentCart = async ({
  ovhSubsidiary,
  agentIp,
  agentRegionName,
  agentServiceName,
}: CreateBackupAgentCartParams): Promise<CreateCartResult> =>
  createCart({
    ovhSubsidiary,
    items: [
      {
        itemEndpoint: 'backupServices',
        options: {
          planCode: 'backup-tenant',
          pricingMode: 'default',
          duration: 'P1M',
          quantity: 1,
        },
        productOptions: [
          {
            planCode: 'backup-vault-paygo',
            pricingMode: 'default',
            quantity: 1,
            duration: 'P1M',
            configurations: [
              { label: 'agent-ip', value: agentIp },
              { label: 'agent-regionname', value: agentRegionName },
              { label: 'agent-servicename', value: agentServiceName },
            ],
          },
          {
            planCode: 'vspc-tenant',
            pricingMode: 'default',
            duration: 'P1M',
            quantity: 1,
          },
        ],
      },
    ],
  });

export const useCreateBackupAgentCart = () => {
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();

  return useMutation<
    CreateCartResult,
    ApiError,
    Omit<CreateBackupAgentCartParams, 'ovhSubsidiary'>
  >({
    mutationFn: (params) => createBackupAgentCart({ ...params, ovhSubsidiary }),
  });
};
