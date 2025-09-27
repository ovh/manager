import { getActionHrefByName } from '@/data/hooks/instance/selectors/instances.selector';
import { getInstanceStatus } from '@/pages/instances/mapper/status.mapper';
import { TAction, TActionLink } from '@/types/instance/action/action.type';
import { TActionName, TInternalActionName } from '@/types/instance/common.type';
import {
  TInstance,
  TInstanceAction,
  TInstanceAddress,
  TInstanceAddresses,
  TInstanceBackup,
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
  actionsLinks: TAction[];
  networks: TInstanceAddress[];
};

type TPrivateNetwork = {
  previews: TInstanceAddress[];
  otherNetworks: TInstanceAddress[] | null;
};

type TBackupsInfo = {
  total: number;
  lastUpdated: string | null;
};

export type TInstanceDashboardViewModel = {
  id: string;
  name: string;
  flavor: TFlavor | null;
  region: TInstanceRegion;
  publicNetwork: TPublicNetwork;
  privateNetwork: TPrivateNetwork;
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
  backupsInfo: TBackupsInfo | null;
  actions: TInstanceActions;
  canActivateMonthlyBilling: boolean;
  isDeleteEnabled: boolean;
  isEditEnabled: boolean;
  isBackupEnabled: boolean;
  isVncEnabled: boolean;
} | null;

const isEditionEnabled = (actions: TInstanceAction[]) =>
  actions.some(({ name }) => name === 'edit');

const isVncEnabled = (actions: TInstanceAction[]) =>
  actions.some(({ name }) => name === 'vnc');

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

const canCreateBackup = (actions: TInstanceAction[]) =>
  actions.some(({ name }) => name === 'create_backup');

const buildInternalActionsHref = (instanceId: string, region: string) => {
  const actions = new Set(['stop', 'start', 'shelve', 'unshelve', 'reinstall']);

  return [
    { edit: `../${instanceId}/edit` },
    {
      soft_reboot: `../${instanceId}/soft-reboot?region=${region}`,
    },
    {
      hard_reboot: `../${instanceId}/hard-reboot?region=${region}`,
    },
    { rescue: `../${instanceId}/rescue/start?region=${region}` },
    { unrescue: `../${instanceId}/rescue/end?region=${region}` },
    {
      create_backup: `../${instanceId}/backup?region=${region}`,
    },
    ...Array.from(actions).map((action) => ({
      [action]: `../${instanceId}/${action}?region=${region}`,
    })),
  ].reduce((acc, item) => {
    const [key, value] = Object.entries(item)[0] as [
      TInternalActionName,
      string,
    ];
    acc[key] = { path: value, isExternal: false };
    return acc;
  }, {} as Record<TInternalActionName, TActionLink>);
};

const buildExternalActionsHref = (
  projectUrl: string,
  id: string,
  region: string,
) => {
  const searchParams = new URLSearchParams({
    ipType: 'floating_ip',
    region,
    instance: id,
  });

  return {
    create_autobackup: { path: `${projectUrl}/workflow/new`, isExternal: true },
    assign_floating_ip: {
      path: `${projectUrl}/public-ips/order?${searchParams.toString()}`,
      isExternal: true,
    },
  };
};

const isAdditionalAction = ({ name }: { name: TActionName }) => {
  const excludeActions = [
    'details',
    'delete',
    'activate_monthly_billing',
    'create_backup',
    'vnc',
  ];

  return !excludeActions.includes(name);
};

const mapActions = (
  instance: TInstance,
  projectUrl: string,
): TInstanceActions =>
  instance.actions
    .filter(isAdditionalAction)
    .reduce<TInstanceActions>((acc, action) => {
      const { group, name } = action;
      const newAction = {
        label: `pci_instances_list_action_${name}`,
        link: getActionHrefByName(projectUrl, name, {
          id: instance.id,
          region: instance.region.name,
        })(buildInternalActionsHref, buildExternalActionsHref),
      };
      const foundAction = acc.get(group);
      if (!foundAction) return acc.set(group, [newAction]);
      foundAction.push(newAction);
      return acc;
    }, new Map() as TInstanceActions);

const buildPublicNetworkActionLinks = (
  baseUrl: string,
  ipv4: string,
): TAction[] => {
  const ipParams = `ip=${ipv4}&ipBlock=${ipv4}`;

  return [
    { label: 'change_dns', link: { path: baseUrl } },
    {
      label: 'firewall_settings',
      link: {
        path: `${baseUrl}?action=toggleFirewall&${ipParams}`,
      },
    },
  ].map((action) => ({
    ...action,
    link: { ...action.link, isExternal: true, isTargetBlank: true },
  }));
};

const mapPublicNetwork = (
  dedicatedUrl: string,
  addresses: TInstanceAddresses,
) => {
  const networks = addresses.get('floating') ?? addresses.get('public') ?? [];
  const ipv4 = networks.find((network) => network.version === 4)?.ip ?? '';

  return {
    isFloatingIp: !!addresses.get('floating'),
    actionsLinks: buildPublicNetworkActionLinks(dedicatedUrl, ipv4),
    networks,
  };
};

const mapPrivateNetwork = (addresses: TInstanceAddresses) => {
  const networks = addresses.get('private') ?? [];
  const otherNetworks = networks.slice(2);

  return {
    previews: networks.slice(0, 2),
    otherNetworks: otherNetworks.length > 0 ? otherNetworks : null,
  };
};

type TUrlBuilderParams = {
  projectUrl: string;
  dedicatedUrl: string;
};

const getBackupsInfo = (backups: TInstanceBackup[], locale: string) => ({
  total: backups.length,
  lastUpdated: backups[0]
    ? new Date(backups[0].createdAt).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null, // the last backup is always the first because backups is already sorted from the api
});

export const selectInstanceDashboard = (
  { projectUrl, dedicatedUrl }: TUrlBuilderParams,
  locale: string,
  instance?: TInstance,
): TInstanceDashboardViewModel => {
  if (!instance) return null;

  return {
    id: instance.id,
    name: instance.name,
    flavor: instance.flavor ? mapFlavor(instance.flavor) : null,
    region: instance.region,
    publicNetwork: mapPublicNetwork(dedicatedUrl, instance.addresses),
    privateNetwork: mapPrivateNetwork(instance.addresses),
    pricings: mapPricings(instance.pricings || []),
    task: instance.task,
    status: getInstanceStatus(instance.status),
    image: instance.image?.name ?? '',
    volumes: instance.volumes ?? [],
    sshKey: instance.sshKey,
    login: instance.login,
    backupsInfo: instance.backups
      ? getBackupsInfo(instance.backups, locale)
      : null,
    actions: mapActions(instance, projectUrl),
    canActivateMonthlyBilling: canActivateMonthlyBilling(instance.actions),
    isDeleteEnabled: canDeleteInstance(instance.actions),
    isEditEnabled: isEditionEnabled(instance.actions),
    isBackupEnabled: canCreateBackup(instance.actions),
    isVncEnabled: isVncEnabled(instance.actions),
  };
};
