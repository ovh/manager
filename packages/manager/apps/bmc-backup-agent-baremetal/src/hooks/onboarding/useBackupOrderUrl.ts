import { useCallback } from 'react';

import JSURL from 'jsurl';

export function useBackupOrderUrl() {
  const generatePayload = useCallback(
    (agentIp: string, agentRegionName: string, agentServiceName: string) => {
      return [
        {
          productId: 'backupServices',
          planCode: 'backup-tenant',
          pricingMode: 'default',
          quantity: 1,
          configuration: [],
          option: [
            {
              planCode: 'backup-vault-paygo',
              pricingMode: 'default',
              quantity: 1,
              configuration: [{ agentIp }, { agentRegionName }, { agentServiceName }],
            },
            {
              planCode: 'vspc-tenant',
              pricingMode: 'default',
              configuration: [],
              quantity: 1,
            },
          ],
        },
      ];
    },
    [],
  );

  const generateOrderExpressUrl = useCallback(
    (agentIp: string, agentRegionName: string, agentServiceName: string) => {
      const payload = generatePayload(agentIp, agentRegionName, agentServiceName);

      const encoded = JSURL.stringify(payload);

      return `https://order.eu.ovhcloud.com/fr/express/#/express/review?products=${encoded}`;
    },
    [generatePayload],
  );

  return { generateOrderExpressUrl };
}
