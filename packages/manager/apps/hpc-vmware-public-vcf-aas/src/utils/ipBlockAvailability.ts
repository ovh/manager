import { VCDIpBlock } from '@ovh-ux/manager-module-vcd-api';

export const isIpBlockAvailable = (ipBlock: VCDIpBlock): boolean => {
  const availableStatuses: VCDIpBlock['resourceStatus'][] = [
    'READY',
    'CREATING',
    'UPDATING',
  ];

  return (
    !ipBlock.currentState.edgeGatewayId &&
    availableStatuses.includes(ipBlock.resourceStatus)
  );
};
