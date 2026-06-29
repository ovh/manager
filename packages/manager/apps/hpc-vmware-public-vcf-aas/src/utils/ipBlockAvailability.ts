import { VCDIpBlock } from '@ovh-ux/manager-module-vcd-api';

export const isIpBlockAvailable = (ipBlock: VCDIpBlock): boolean => {
  return (
    !ipBlock.currentState.edgeGatewayId && ipBlock.resourceStatus === 'READY'
  );
};
