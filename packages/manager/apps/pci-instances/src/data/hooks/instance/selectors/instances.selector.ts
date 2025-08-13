import { InfiniteData } from '@tanstack/react-query';
import { TInstanceDto, TInstanceStatusDto } from '@/types/instance/api.type';
import {
  TAddress,
  TInstance,
  TInstanceAction,
  TInstanceActions,
  TInstanceAddressType,
  TInstanceStatus,
  TInstanceStatusSeverity,
} from '@/types/instance/entity.type';
import { TActionName } from '@/types/instance/common.type';

const getInstanceStatusSeverity = (
  status: TInstanceStatusDto,
): TInstanceStatusSeverity => {
  switch (status) {
    case 'BUILDING':
    case 'REBOOT':
    case 'REBUILD':
    case 'REVERT_RESIZE':
    case 'SOFT_DELETED':
    case 'VERIFY_RESIZE':
    case 'MIGRATING':
    case 'RESIZE':
    case 'BUILD':
    case 'SHUTOFF':
    case 'RESCUE':
    case 'SHELVED':
    case 'SHELVED_OFFLOADED':
    case 'RESCUING':
    case 'UNRESCUING':
    case 'SNAPSHOTTING':
    case 'RESUMING':
    case 'HARD_REBOOT':
    case 'PASSWORD':
    case 'PAUSED':
      return 'warning';
    case 'DELETED':
    case 'ERROR':
    case 'STOPPED':
    case 'SUSPENDED':
    case 'UNKNOWN':
      return 'error';
    case 'ACTIVE':
    case 'RESCUED':
    case 'RESIZED':
      return 'success';
    default:
      return 'info';
  }
};

const getInstanceTaskState = (taskState: string): TInstance['taskState'] =>
  taskState.length > 0 ? taskState : null;

const getInstanceStatus = (status: TInstanceStatusDto): TInstanceStatus => ({
  label: status,
  severity: getInstanceStatusSeverity(status),
});

const getActionHrefByName = (
  projectUrl: string,
  name: TActionName,
  { region, id }: Pick<TInstance, 'id' | 'region'>,
): TInstanceAction['link'] => {
  if (name === 'details') {
    return { path: id, isExternal: false };
  }

  if (name === 'edit') {
    return {
      path: `${id}/edit`,
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
      path: `soft-reboot?instanceId=${id}&region=${region}`,
      isExternal: false,
    };
  }

  if (name === 'hard_reboot') {
    return {
      path: `hard-reboot?instanceId=${id}&region=${region}`,
      isExternal: false,
    };
  }

  if (name === 'rescue') {
    return {
      path: `rescue/start?instanceId=${id}&region=${region}`,
      isExternal: false,
    };
  }

  if (name === 'unrescue') {
    return {
      path: `rescue/end?instanceId=${id}&region=${region}`,
      isExternal: false,
    };
  }

  if (name === 'create_backup') {
    return {
      path: `backup?instanceId=${id}&region=${region}`,
      isExternal: false,
    };
  }

  if (name === 'activate_monthly_billing') {
    return {
      path: `billing/monthly/activate?instanceId=${id}&region=${region}`,
      isExternal: false,
    };
  }

  const actions = new Set([
    'delete',
    'stop',
    'start',
    'shelve',
    'unshelve',
    'reinstall',
  ]);

  if (actions.has(name)) {
    return {
      path: `${name}?instanceId=${id}&region=${region}`,
      isExternal: false,
    };
  }

  return { path: '', isExternal: false };
};

const mapInstanceAddresses = (instance: TInstanceDto) =>
  instance.addresses.reduce((acc, { type, ...rest }) => {
    const foundAddresses = acc.get(type);
    if (foundAddresses) {
      const ipAlreadyExists = !!foundAddresses.find(({ ip }) => ip === rest.ip);
      if (!ipAlreadyExists) foundAddresses.push(rest);
      return acc;
    }
    return acc.set(type, [rest]);
  }, new Map<TInstanceAddressType, TAddress[]>());

const mapInstanceActions = (
  instance: TInstanceDto,
  projectUrl: string,
): TInstanceActions =>
  instance.actions.reduce<TInstanceActions>((acc, action) => {
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

export const instancesSelector = (
  { pages }: InfiniteData<TInstanceDto[], number>,
  limit: number,
  projectUrl: string,
): TInstance[] =>
  pages
    .flatMap((page) => (page.length > limit ? page.slice(0, limit) : page))
    .map((instanceDto) => ({
      ...instanceDto,
      status: getInstanceStatus(instanceDto.status),
      addresses: mapInstanceAddresses(instanceDto),
      actions: mapInstanceActions(instanceDto, projectUrl),
      taskState: getInstanceTaskState(instanceDto.taskState),
      creationDate: instanceDto.creationDate
        ? new Date(instanceDto.creationDate)
        : null,
    }));
