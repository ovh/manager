import { HOSTNAME_REGIONS } from '@ovh-ux/manager-config';

export const getRegion = () =>
  HOSTNAME_REGIONS[window.location.hostname] || 'EU';
