import { VCDDatacentre } from '@ovh-ux/manager-module-vcd-api';

export const isEdgeCompatibleVDC = (vdc: VCDDatacentre) =>
  vdc?.currentState?.offerProfile === 'NSX';
