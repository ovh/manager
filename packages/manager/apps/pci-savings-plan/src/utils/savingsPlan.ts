import { TFunction } from 'i18next';
import {
  InstanceInfo,
  InstanceTechnicalName,
  ResourceType,
} from '@/types/CreatePlan.type';
import { SavingsPlanPlanedChangeStatus, SavingsPlanService } from '@/types';

export const REGEX = '^[a-zA-Z0-9_-]{1,60}$';

export const isValidSavingsPlanName = (name: string): boolean => {
  return new RegExp(REGEX).test(name);
};

export const getInstancesInformation = (t: TFunction): InstanceInfo[] => [
  {
    id: '1',
    category: ResourceType.instance,
    technicalName: InstanceTechnicalName.b3,
    label: t('resource_tabs_general_purpose'),
  },
  {
    id: '2',
    category: ResourceType.instance,
    technicalName: InstanceTechnicalName.c3,
    label: t('resource_tabs_cpu'),
  },
  {
    id: '3',
    category: ResourceType.instance,
    technicalName: InstanceTechnicalName.r3,
    label: t('resource_tabs_ram'),
  },
  {
    id: '4',
    category: ResourceType.rancher,
    technicalName: InstanceTechnicalName.rancher,
    label: t('resource_tabs_rancher'),
  },
];

export const getBigestActiveSavingsPlan = (
  savingsPlan: SavingsPlanService[],
) => {
  const onlyActivePlanBySize = savingsPlan
    ?.filter(
      (plan) =>
        plan.periodEndAction === SavingsPlanPlanedChangeStatus.REACTIVATE,
    )
    .sort((a, b) => b.size - a.size);

  return onlyActivePlanBySize?.[0];
};

// We don't have a better way to check that, api return only a specific code and not an id related to scope (instance, rancher),
// So if we have number in the flavor (b3-8, c3-16) it's an instance else it's a Rancher
export const isInstanceFlavor = (flavor: string) => /\d/.test(flavor);
