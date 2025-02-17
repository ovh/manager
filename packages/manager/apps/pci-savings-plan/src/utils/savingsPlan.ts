import { TFunction } from 'i18next';
import { formatDate } from './formatter/date';
import {
  InstanceInfo,
  InstanceTechnicalName,
  ResourceType,
} from '@/types/CreatePlan.type';
import { SavingsPlanPlanedChangeStatus, SavingsPlanService } from '@/types';
import { SavingsPlanFlavorConsumption } from '@/types/savingsPlanConsumption.type';

export const REGEX = '^[a-zA-Z0-9_-]{1,60}$';

export const isValidSavingsPlanName = (name: string): boolean => {
  return new RegExp(REGEX).test(name);
};

export const buildDisplayName = (instanceDisplayName: string) =>
  `Savings-Plan-${instanceDisplayName}-${formatDate(new Date())}`;

export const getInstanceDisplayName = (
  instanceTechnicalName: InstanceTechnicalName,
) => {
  switch (instanceTechnicalName) {
    case InstanceTechnicalName.c3:
      return 'CPU';
    case InstanceTechnicalName.r3:
      return 'RAM';
    case InstanceTechnicalName.rancher:
      return 'RANCHER';
    case InstanceTechnicalName.b3:
    default:
      return 'GP';
  }
};

export enum DeploymentMode {
  '1AZ' = '1AZ',
  '3AZ' = '3AZ',
}

export const getDeploymentOptions = (t: TFunction) => [
  {
    name: DeploymentMode['1AZ'],
    description: t('deployment_one_az'),
  },
  {
    name: DeploymentMode['3AZ'],
    description: t('deployment_three_az'),
  },
];
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

export const getActiveSavingsPlan = (savingsPlan: SavingsPlanService[]) =>
  savingsPlan?.filter(
    (plan) => plan.periodEndAction === SavingsPlanPlanedChangeStatus.REACTIVATE,
  );

// We don't have a better way to check that, api return only a specific code and not an id related to scope (instance, rancher),
// So if we have number in the flavor (b3-8, c3-16) it's an instance else it's a Rancher
export const isInstanceFlavor = (flavor: string) => /\d/.test(flavor);
