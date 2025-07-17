import { TFunction } from 'i18next';
import { Resource, ResourceType } from '@/types/CreatePlan.type';
import serviceSrc from '../assets/images/service.png';
import rancherSrc from '../assets/images/rancher.png';

export const getResources = (t: TFunction): Resource[] => [
  {
    value: ResourceType.instance,
    label: t('resource_tabs_instance'),
    img: serviceSrc,
  },
  {
    value: ResourceType.rancher,
    label: t('resource_tabs_rancher'),
    img: rancherSrc,
  },
];
