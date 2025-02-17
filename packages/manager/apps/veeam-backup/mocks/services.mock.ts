import { TServiceConsumption } from '../src/type/service-consumption.type';
import { VEEAM_BACKUP_CONSUMPTION_PLAN_CODE } from '../src/pages/dashboard/Dashboard.constants';

export const serviceConsumptionResponse: TServiceConsumption[] = [
  {
    planCode: VEEAM_BACKUP_CONSUMPTION_PLAN_CODE.BRONZE,
    quantity: 50,
    uniqueId: '1',
  },
  {
    planCode: VEEAM_BACKUP_CONSUMPTION_PLAN_CODE.SILVER,
    quantity: 50,
    uniqueId: '2',
  },
];
