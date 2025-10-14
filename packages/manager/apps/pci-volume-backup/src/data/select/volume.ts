import { TVolume } from '@ovh-ux/manager-pci-common';

export const isVolumeDeleted = (volume: TVolume) =>
  ['deleted', 'deleting'].includes(volume.status);
