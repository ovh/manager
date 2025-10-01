import { InfiniteData } from '@tanstack/react-query';
import { TAggregatedInstanceDto } from '@/types/instance/api.type';
import {
  TAggregatedInstanceAddress,
  TAggregatedInstance,
  TAggregatedInstanceActions,
  TInstanceAddressType,
} from '@/types/instance/entity.type';
import {
  TActionName,
  TExternalActionName,
  TInternalActionName,
} from '@/types/instance/common.type';
import { getInstanceStatus } from '@/pages/instances/mapper/status.mapper';
import { TActionLink } from '@/types/instance/action/action.type';

const getInstanceTaskState = (
  taskState: string,
): TAggregatedInstance['taskState'] =>
  taskState.length > 0 ? taskState : null;

const isInternalAction = (action: TActionName): action is TInternalActionName =>
  [
    'details',
    'edit',
    'soft_reboot',
    'hard_reboot',
    'rescue',
    'unrescue',
    'create_backup',
    'activate_monthly_billing',
    'delete',
    'stop',
    'start',
    'shelve',
    'unshelve',
    'reinstall',
  ].includes(action);

const isExternalAction = (action: TActionName): action is TExternalActionName =>
  ['create_autobackup', 'assign_floating_ip'].includes(action);

const buildInternalActionsHref = (instanceId: string, region: string) => {
  const actions = new Set([
    'delete',
    'stop',
    'start',
    'shelve',
    'unshelve',
    'reinstall',
  ]);

  return [
    { details: `${instanceId}?region=${region}` },
    { edit: `${instanceId}/edit` },
    {
      soft_reboot: `soft-reboot?instanceId=${instanceId}&region=${region}`,
    },
    {
      hard_reboot: `hard-reboot?instanceId=${instanceId}&region=${region}`,
    },
    { rescue: `rescue/start?instanceId=${instanceId}&region=${region}` },
    { unrescue: `rescue/end?instanceId=${instanceId}&region=${region}` },
    {
      create_backup: `backup?instanceId=${instanceId}&region=${region}`,
    },
    {
      activate_monthly_billing: `billing/monthly/activate?instanceId=${instanceId}&region=${region}`,
    },
    ...Array.from(actions).map((action) => ({
      [action]: `${action}?instanceId=${instanceId}&region=${region}`,
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

export const getActionHrefByName = (
  projectUrl: string,
  name: TActionName,
  { id, region }: { id: string; region: string },
) => (
  buildInternalActionsHref: (
    id: string,
    region: string,
  ) => Record<TInternalActionName, TActionLink>,
  buildExternalActionsHref: (
    projectUrl: string,
    id: string,
    region: string,
  ) => Record<TExternalActionName, TActionLink>,
): TActionLink => {
  if (isInternalAction(name)) return buildInternalActionsHref(id, region)[name];
  if (isExternalAction(name))
    return buildExternalActionsHref(projectUrl, id, region)[name];

  return { path: '', isExternal: false };
};

const mapInstanceAddresses = (instance: TAggregatedInstanceDto) =>
  instance.addresses.reduce((acc, { type, ...rest }) => {
    const foundAddresses = acc.get(type);
    if (foundAddresses) {
      const ipAlreadyExists = !!foundAddresses.find(({ ip }) => ip === rest.ip);
      if (!ipAlreadyExists) foundAddresses.push(rest);
      return acc;
    }
    return acc.set(type, [rest]);
  }, new Map<TInstanceAddressType, TAggregatedInstanceAddress[]>());

const isActionToDisplay = (name: TActionName) => name !== 'vnc';

const mapInstanceActions = (
  instance: TAggregatedInstanceDto,
  projectUrl: string,
): TAggregatedInstanceActions =>
  instance.actions.reduce<TAggregatedInstanceActions>((acc, action) => {
    const { group, name } = action;

    if (isActionToDisplay(name)) {
      const newAction = {
        label: `pci_instances_list_action_${name}`,
        link: getActionHrefByName(
          projectUrl,
          name,
          instance,
        )(buildInternalActionsHref, buildExternalActionsHref),
      };
      const foundAction = acc.get(group);
      if (!foundAction) return acc.set(group, [newAction]);
      foundAction.push(newAction);
    }

    return acc;
  }, new Map());

export const instancesSelector = (
  { pages }: InfiniteData<TAggregatedInstanceDto[], number>,
  limit: number,
  projectUrl: string,
): TAggregatedInstance[] =>
  pages
    .flatMap((page) => (page.length > limit ? page.slice(0, limit) : page))
    .map((instanceDto) => ({
      ...instanceDto,
      status: getInstanceStatus(instanceDto.status),
      addresses: mapInstanceAddresses(instanceDto),
      actions: mapInstanceActions(instanceDto, projectUrl),
      taskState: getInstanceTaskState(instanceDto.taskState),
    }));
