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
  flavor: TFlavor;
  region: TInstanceRegion;
  pricings: TPrice[];
  status: {
    label: TInstanceStatus;
    severity: TInstanceStatusSeverity;
  };
  task: TInstanceTaskStatus;
  canActivateMonthlyBilling: boolean;
  isEditEnabled: boolean;
} | null;

const isEditionEnabled = (actions: TInstanceAction[]) =>
  actions.some(({ name }) => name === 'edit');

const mapFlavor = ({ name, specs }: TInstanceFlavor) => ({
  name,
  ram: specs ? `${specs.ram.value} ${specs.ram.unit}` : '-',
  cpu: specs ? `${specs.vcores.value} ${specs.vcores.unit}` : '-',
});

const mapPricings = (pricings: TInstancePrice[]) =>
  pricings.map((pricing) => ({
    label: pricing.type !== 'licence' ? 'instance' : 'licence', // label will be a translation key
    type: pricing.type,
    value: pricing.value,
  }));

const canActivateMonthlyBilling = (actions: TInstanceAction[]) =>
  actions.some(({ name }) => name === 'activate_monthly_billing');

export const selectInstanceDashboard = (
  instance?: TInstance,
): TInstanceDashboardViewModel => {
  if (!instance) return null;

  return {
    id: instance.id,
    name: instance.name,
    flavor: mapFlavor(instance.flavor),
    region: instance.region,
    pricings: mapPricings(instance.pricings || []),
    task: instance.task,
    status: getInstanceStatus(instance.status),
    canActivateMonthlyBilling: canActivateMonthlyBilling(instance.actions),
    isEditEnabled: isEditionEnabled(instance.actions),
  };
};
