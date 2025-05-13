import { TFunction } from 'i18next';
import { InstanceTechnicalName } from '@/types/CreatePlan.type';
import { formatDate } from './formatter/date';

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
