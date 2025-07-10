import { getInstanceStatus } from '@/pages/instances/mapper/status.mapper';
import {
  TInstance,
  TInstanceAction,
  TInstanceFlavor,
  TInstancePrice,
  TInstanceRegion,
  TInstanceStatus,
  TInstanceStatusSeverity,
  TInstanceTaskStatus,
} from '@/types/instance/entity.type';

type TPrice = {
  label: string;
  type: string;
  value: number;
};

type TFlavor = {
  name: string;
  ram: string;
  cpu: string;
};

export type TInstanceDashboardViewModel = {
  id: string;
  name: string;
  flavor: TFlavor | null;
  region: TInstanceRegion;
  pricings: TPrice[];
  status: {
    label: TInstanceStatus;
    severity: TInstanceStatusSeverity;
  };
  task: TInstanceTaskStatus;
  isEditEnabled: boolean;
} | null;

const isEditionEnabled = (actions: TInstanceAction[]) =>
  actions.some(({ name }) => name === 'edit');

const mapFlavor = ({ name, specs }: TInstanceFlavor) => ({
  name,
  ram: specs ? `${specs.ram.value} ${specs.ram.unit}` : '-',
  cpu: specs ? `${specs.cpu.value} ${specs.cpu.unit}` : '-',
});

const mapPricings = (pricings: TInstancePrice[]) =>
  pricings.map((pricing) => ({
    label: pricing.type !== 'licence' ? 'instance' : 'licence', // label will be a translation key
    type: pricing.type,
    value: pricing.priceInUcents,
  }));

export const selectInstanceDashboard = (
  instance?: TInstance,
): TInstanceDashboardViewModel => {
  if (!instance) return null;

  return {
    id: instance.id,
    name: instance.name,
    flavor: instance.flavor ? mapFlavor(instance.flavor) : null,
    region: instance.region,
    pricings: mapPricings(instance.pricings || []),
    task: instance.task,
    status: getInstanceStatus(instance.status),
    isEditEnabled: isEditionEnabled(instance.actions),
  };
};
