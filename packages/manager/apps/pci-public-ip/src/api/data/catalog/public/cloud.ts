import { getCatalog } from '@ovh-ux/manager-pci-common';

export const getCloudCatalog = (ovhSubsidiary: string) =>
  getCatalog(ovhSubsidiary, 'cloud');
