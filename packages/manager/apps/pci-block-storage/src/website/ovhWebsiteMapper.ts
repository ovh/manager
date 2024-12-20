import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

export function getBaseUrl(ovhSubsidiary: OvhSubsidiary): string {
  switch (ovhSubsidiary) {
    case OvhSubsidiary.ASIA:
    case OvhSubsidiary.DE:
    case OvhSubsidiary.FR:
    case OvhSubsidiary.IT:
    case OvhSubsidiary.NL:
    case OvhSubsidiary.PL:
    case OvhSubsidiary.PT:
      return `https://www.ovhcloud.com/${ovhSubsidiary.toLowerCase()}`;
    case OvhSubsidiary.AU:
    case OvhSubsidiary.CA:
    case OvhSubsidiary.GB:
    case OvhSubsidiary.IE:
    case OvhSubsidiary.IN:
    case OvhSubsidiary.SG:
      return `https://www.ovhcloud.com/en-${ovhSubsidiary.toLowerCase()}`;
    case OvhSubsidiary.ES:
      return 'https://www.ovhcloud.com/es-es';
    case OvhSubsidiary.MA:
    case OvhSubsidiary.SN:
    case OvhSubsidiary.TN:
      return `https://www.ovhcloud.com/fr-${ovhSubsidiary.toLowerCase()}`;
    case OvhSubsidiary.QC:
      return 'https://www.ovhcloud.com/fr-ca';
    case OvhSubsidiary.US:
      return 'https://us.ovhcloud.com';
    case OvhSubsidiary.WS:
      return 'https://www.ovhcloud.com/es';
    case OvhSubsidiary.DEFAULT:
    default:
      return 'https://www.ovhcloud.com/en';
  }
}
