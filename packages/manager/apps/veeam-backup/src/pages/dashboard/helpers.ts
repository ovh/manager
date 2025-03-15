import { TServiceConsumption } from '@/type/service-consumption.type';
import { VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE } from '@/pages/dashboard/Dashboard.constants';

export const filterConsumedVms = (consumptions: TServiceConsumption[]) => {
  return consumptions.filter(
    (consumption) =>
      consumption.planCode === VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE,
  );
};
