import { getInstanceStatus } from '@/pages/instances/mapper/status.mapper';
import { TAction, TActionLink } from '@/types/instance/action/action.type';
import { TActionName } from '@/types/instance/common.type';
import {
  TInstance,
  TInstanceAction,
  TInstanceAddress,
  TInstanceAddresses,
  TInstanceFlavor,
  TInstancePrice,
  TInstanceRegion,
  TInstanceStatus,
  TInstanceStatusSeverity,
  TInstanceTaskStatus,
  TInstanceVolume,
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
  storage: string;
  publicBandwidth: string;
};

type TInstanceActions = Map<string, TAction[]>;

type TPublicNetwork = {
  isFloatingIp: boolean;
  networks: TInstanceAddress[];
};

export type TInstanceDashboardViewModel = {
  id: string;
  name: string;
  flavor: TFlavor | null;
  region: TInstanceRegion;
  publicNetwork: TPublicNetwork;
  privateNetwork: TInstanceAddress[];
  pricings: TPrice[];
  status: {
    label: TInstanceStatus;
    severity: TInstanceStatusSeverity;
  };
  task: TInstanceTaskStatus;
  image: string;
  volumes: TInstanceVolume[];
  sshKey: string | null;
  login: string | null;
  actions: TInstanceActions;
  canActivateMonthlyBilling: boolean;
  isDeleteEnabled: boolean;
  isEditEnabled: boolean;
} | null;

const isEditionEnabled = (actions: TInstanceAction[]) =>
  actions.some(({ name }) => name === 'edit');

const mapFlavor = ({ name, specs }: TInstanceFlavor) => ({
  name,
  ram: specs ? `${specs.ram.value} ${specs.ram.unit}` : '-',
  cpu: specs ? `${specs.cpu.value} ${specs.cpu.unit}` : '-',
  storage: specs ? `${specs.storage.value} ${specs.storage.unit}` : '-',
  publicBandwidth: specs
    ? `${specs.bandwidth.public.value} ${specs.bandwidth.public.unit}`
    : '-',
});

const mapPricings = (pricings: TInstancePrice[]) =>
  pricings
    .filter((pricing) => pricing.status === 'enabled')
    .map((pricing) => ({
      label: pricing.type !== 'licence' ? 'instance' : 'licence', // label will be a translation key
      type: pricing.type,
      value: pricing.priceInUcents,
    }));

const canActivateMonthlyBilling = (actions: TInstanceAction[]) =>
  actions.some(({ name }) => name === 'activate_monthly_billing');

const canDeleteInstance = (actions: TInstanceAction[]) =>
  actions.some(({ name }) => name === 'delete');

// TODO: find a way to handle this properly (where to build path and translated label)
const getActionHrefByName = (
  projectUrl: string,
  name: TActionName,
  { region: { name: region }, id }: Pick<TInstance, 'id' | 'region'>,
): TActionLink => {
  if (name === 'edit') {
    return {
      path: `../${id}/edit`,
      isExternal: false,
    };
  }

  if (name === 'create_autobackup') {
    return { path: `${projectUrl}/workflow/new`, isExternal: true };
  }

  if (name === 'assign_floating_ip') {
    const searchParams = new URLSearchParams({
      ipType: 'floating_ip',
      region,
      instance: id,
    });

    return {
      path: `${projectUrl}/public-ips/order?${searchParams.toString()}`,
      isExternal: true,
    };
  }

  if (name === 'soft_reboot') {
    return {
      path: `../${id}/soft-reboot?region=${region}`,
      isExternal: false,
    };
  }

  if (name === 'hard_reboot') {
    return {
      path: `../${id}/hard-reboot?region=${region}`,
      isExternal: false,
    };
  }

  if (name === 'rescue') {
    return {
      path: `../${id}/rescue/start?region=${region}`,
      isExternal: false,
    };
  }

  if (name === 'unrescue') {
    return {
      path: `../${id}/rescue/end?region=${region}`,
      isExternal: false,
    };
  }

  if (name === 'create_backup') {
    return {
      path: `../${id}/backup?region=${region}`,
      isExternal: false,
    };
  }

  const actions = new Set(['stop', 'start', 'shelve', 'unshelve', 'reinstall']);

  if (actions.has(name)) {
    return {
      path: `../${id}/${name}?region=${region}`,
      isExternal: false,
    };
  }

  return { path: '', isExternal: false };
};

const mapActions = (
  instance: TInstance,
  projectUrl: string,
): TInstanceActions =>
  instance.actions
    .filter(
      ({ name }) =>
        !['details', 'delete', 'activate_monthly_billing'].includes(name),
    )
    .reduce<TInstanceActions>((acc, action) => {
      const { group, name } = action;
      const newAction = {
        label: `pci_instances_list_action_${name}`,
        link: getActionHrefByName(projectUrl, name, instance),
      };
      const foundAction = acc.get(group);
      if (!foundAction) return acc.set(group, [newAction]);
      foundAction.push(newAction);
      return acc;
    }, new Map() as TInstanceActions);

const mapPublicNetwork = (addresses: TInstanceAddresses) => ({
  isFloatingIp: !!addresses.get('floating'),
  networks: (addresses.get('floating') ?? addresses.get('public')) || [],
});

export const selectInstanceDashboard = (
  projectUrl: string,
  instance?: TInstance,
): TInstanceDashboardViewModel => {
  if (!instance) return null;

  return {
    id: instance.id,
    name: instance.name,
    flavor: instance.flavor ? mapFlavor(instance.flavor) : null,
    region: instance.region,
    publicNetwork: mapPublicNetwork(instance.addresses),
    privateNetwork: instance.addresses.get('private') || [],
    pricings: mapPricings(instance.pricings || []),
    task: instance.task,
    status: getInstanceStatus(instance.status),
    image: instance.image?.name ?? '',
    volumes: instance.volumes ?? [],
    sshKey: instance.sshKey,
    login: instance.login,
    actions: mapActions(instance, projectUrl),
    canActivateMonthlyBilling: canActivateMonthlyBilling(instance.actions),
    isDeleteEnabled: canDeleteInstance(instance.actions),
    isEditEnabled: isEditionEnabled(instance.actions),
  };
};
