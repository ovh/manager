import { StepIdsEnum } from '@/api/types';

export const initStartupSteps = (tOrder: (param: string) => string) =>
  new Map([
    [
      StepIdsEnum.IP_TYPE,
      {
        id: StepIdsEnum.IP_TYPE,
        key: StepIdsEnum.IP_TYPE,
        title: tOrder('pci_additional_ip_create_step_select_ip'),
        open: true,
      },
    ],
    [
      StepIdsEnum.FAILOVER_COUNTRY,
      {
        id: StepIdsEnum.FAILOVER_COUNTRY,
        key: StepIdsEnum.FAILOVER_COUNTRY,
        title: tOrder(
          'pci_additional_ip_create_step_select_region_failover_ip',
        ),
        open: false,
      },
    ],
    [
      StepIdsEnum.FAILOVER_INSTANCE,
      {
        id: StepIdsEnum.FAILOVER_INSTANCE,
        key: StepIdsEnum.FAILOVER_INSTANCE,
        title: tOrder('pci_additional_ip_create_step_attach_instance'),
        open: false,
      },
    ],
    [
      StepIdsEnum.FLOATING_REGION,
      {
        id: StepIdsEnum.FLOATING_REGION,
        key: StepIdsEnum.FLOATING_REGION,
        title: tOrder(
          'pci_additional_ip_create_step_select_region_floating_ip',
        ),
        open: false,
      },
    ],
    [
      StepIdsEnum.FLOATING_INSTANCE,
      {
        id: StepIdsEnum.FLOATING_INSTANCE,
        key: StepIdsEnum.FLOATING_INSTANCE,
        title: tOrder('pci_additional_ip_create_step_attach_instance'),
        open: false,
      },
    ],
    [
      StepIdsEnum.FLOATING_SUMMARY,
      {
        id: StepIdsEnum.FLOATING_SUMMARY,
        key: StepIdsEnum.FLOATING_SUMMARY,
        title: tOrder('pci_additional_ip_create_step_summary'),
        open: false,
      },
    ],
  ]);
