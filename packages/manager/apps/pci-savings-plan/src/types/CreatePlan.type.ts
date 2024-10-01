import { formatTechnicalInfo } from '@/utils/formatter/formatter';

export enum ResourceType {
  instance = 'instance',
  rancher = 'rancher',
}

export enum InstanceTechnicalName {
  b3 = 'b3',
  c3 = 'c3',
  r3 = 'r3',
  rancher = 'publiccloud-rancher',
}

export type InstanceInfo = {
  id: string;
  category: ResourceType;
  technicalName: InstanceTechnicalName;
  label: string;
  technical: ReturnType<typeof formatTechnicalInfo>[];
};

export type Resource = {
  value: ResourceType;
  label: string;
  img: string;
};
