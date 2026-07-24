import { VCDEdgeGateway } from '@ovh-ux/manager-module-vcd-api';

export const isEdgeCreating = (edge: VCDEdgeGateway): boolean =>
  edge.resourceStatus === 'CREATING';
