import JSURL from 'jsurl';

export const generateOrderExpressUrl = ({
  baseUrl,
  agentIp,
  agentRegionName,
  agentServiceName,
}: {
  baseUrl: string;
  agentIp: string;
  agentRegionName: string;
  agentServiceName: string;
}) => {
  const payload = [
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
          configuration: [
            { label: 'agent-ip', values: [agentIp] },
            { label: 'agent-regionname', values: [agentRegionName] },
            { label: 'agent-servicename', values: [agentServiceName] },
          ],
        },
        {
          planCode: 'vspc-tenant',
          pricingMode: 'default',
          quantity: 1,
          option: [],
        },
      ],
    },
  ];

  const encoded = JSURL.stringify(payload);
  return `${baseUrl}?products=${encoded}`;
};
