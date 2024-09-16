import { getCatalog } from '@ovh-ux/manager-pci-common';

export type TFormattedCatalog = {
  plans: {
    planCode: string;
    invoiceName: string;
  }[];
};

export const getIpCatalog = (ovhSubsidiary: string) =>
  getCatalog(ovhSubsidiary, 'ip-failover');
