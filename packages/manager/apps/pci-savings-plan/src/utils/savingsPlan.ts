import { TFunction } from 'i18next';
import {
  InstanceInfo,
  InstanceTechnicalName,
  ResourceType,
} from '@/types/CreatePlan.type';
import { formatTechnicalInfo } from './formatter/formatter';

export const REGEX = '^[a-zA-Z0-9_-]{1,60}$';

export const isValidSavingsPlanName = (name: string): boolean => {
  return new RegExp(REGEX).test(name);
};

export const getInstancesInformation = (
  technicalList: ReturnType<typeof formatTechnicalInfo>[],
  t: TFunction,
): InstanceInfo[] => [
  {
    id: '1',
    category: ResourceType.instance,
    technicalName: InstanceTechnicalName.b3,
    label: t('resource_tabs_general_purpose'),
    technical: technicalList,
  },
  {
    id: '2',
    category: ResourceType.instance,
    technicalName: InstanceTechnicalName.c3,
    label: t('resource_tabs_cpu'),
    technical: technicalList,
  },
  {
    id: '3',
    category: ResourceType.instance,
    technicalName: InstanceTechnicalName.r3,
    label: t('resource_tabs_ram'),
    technical: technicalList,
  },
  {
    id: '4',
    category: ResourceType.rancher,
    technicalName: InstanceTechnicalName.rancher,
    label: t('resource_tabs_rancher'),
    technical: technicalList,
  },
];
