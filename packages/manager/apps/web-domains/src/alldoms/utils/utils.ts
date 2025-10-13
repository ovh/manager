import { LifecycleCapacitiesEnum } from '@/alldoms/enum/service.enum';

export const hasTerminateAtExpirationDateAction = (
  actions: LifecycleCapacitiesEnum[],
) => actions.includes(LifecycleCapacitiesEnum.TerminateAtExpirationDate);
