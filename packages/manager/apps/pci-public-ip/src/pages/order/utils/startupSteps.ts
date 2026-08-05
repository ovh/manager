import { StepIdsEnum } from '@/api/types';

export const initStartupSteps = () =>
  new Map([
    [
      StepIdsEnum.IP_TYPE,
      {
        id: StepIdsEnum.IP_TYPE,
        key: StepIdsEnum.IP_TYPE,
        open: true,
      },
    ],
    [
      StepIdsEnum.FAILOVER_COUNTRY,
      {
        id: StepIdsEnum.FAILOVER_COUNTRY,
        key: StepIdsEnum.FAILOVER_COUNTRY,
        open: false,
      },
    ],
    [
      StepIdsEnum.FAILOVER_INSTANCE,
      {
        id: StepIdsEnum.FAILOVER_INSTANCE,
        key: StepIdsEnum.FAILOVER_INSTANCE,
        open: false,
      },
    ],
    [
      StepIdsEnum.FLOATING_REGION,
      {
        id: StepIdsEnum.FLOATING_REGION,
        key: StepIdsEnum.FLOATING_REGION,
        open: false,
      },
    ],
    [
      StepIdsEnum.FLOATING_INSTANCE,
      {
        id: StepIdsEnum.FLOATING_INSTANCE,
        key: StepIdsEnum.FLOATING_INSTANCE,
        open: false,
      },
    ],
    [
      StepIdsEnum.FLOATING_SUMMARY,
      {
        id: StepIdsEnum.FLOATING_SUMMARY,
        key: StepIdsEnum.FLOATING_SUMMARY,
        open: false,
      },
    ],
    [
      StepIdsEnum.BASIC_REGION,
      {
        id: StepIdsEnum.BASIC_REGION,
        key: StepIdsEnum.BASIC_REGION,
        open: false,
      },
    ],
    [
      StepIdsEnum.BASIC_INSTANCE,
      {
        id: StepIdsEnum.BASIC_INSTANCE,
        key: StepIdsEnum.BASIC_INSTANCE,
        open: false,
      },
    ],
    [
      StepIdsEnum.BASIC_SUMMARY,
      {
        id: StepIdsEnum.BASIC_SUMMARY,
        key: StepIdsEnum.BASIC_SUMMARY,
        open: false,
      },
    ],
  ]);
