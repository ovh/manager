import { Technical } from '@/types/commercial-catalog.type';

export enum ResourceType {
  instance = 'instance',
  rancher = 'rancher',
}

export enum InstanceTechnicalName {
  b3 = 'b3',
  c3 = 'c3',
  r3 = 'r3',
  rancher = 'rancher',
}

export type InstanceInfo = {
  id: string;
  category: ResourceType;
  technicalName: InstanceTechnicalName;
  label: string;
  technical: {
    name: string;
    technical: Technical;
    hourlyPrice: number;
  }[];
};

export type Resource = {
  value: ResourceType;
  label: string;
  img: string;
};
