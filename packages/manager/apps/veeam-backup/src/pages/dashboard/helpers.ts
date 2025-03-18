import { VeeamBackupOffer } from '@ovh-ux/manager-module-vcd-api';
import { TServiceConsumption } from '@/type/service-consumption.type';

import {
  VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE,
  VEEAM_BACKUP_CONSUMPTION_PLAN_CODE,
} from '@/pages/dashboard/Dashboard.constants';

export const filterConsumedVms = (consumptions: TServiceConsumption[]) => {
  return consumptions.filter(
    (consumption) =>
      consumption.planCode === VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE,
  );
};

export const getConsumption = (
  offerName: VeeamBackupOffer['name'],
  consumptions: TServiceConsumption[],
) => {
  const consumption = consumptions?.find(
    ({ planCode }) =>
      planCode === VEEAM_BACKUP_CONSUMPTION_PLAN_CODE[offerName],
  );
  return consumption?.quantity ?? 0;
};
