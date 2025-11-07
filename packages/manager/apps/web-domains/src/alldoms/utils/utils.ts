import { LifecycleCapacitiesEnum } from '@/common/enum/common.enum';

export const hasTerminateAtExpirationDateAction = (
  actions: LifecycleCapacitiesEnum[],
) => actions.includes(LifecycleCapacitiesEnum.TerminateAtExpirationDate);
