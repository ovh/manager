import {
  TInstance,
  TInstanceAction,
  TInstanceFlavor,
  TInstancePrice,
  TInstanceRegion,
} from '@/types/instance/entity.type';

type TRegion = TInstanceRegion;
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
  region: TRegion;
  pricings: TPrice[];
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
    isEditEnabled: isEditionEnabled(instance.actions),
  };
};
