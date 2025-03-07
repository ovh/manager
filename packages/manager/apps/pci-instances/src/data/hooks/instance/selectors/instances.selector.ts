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

const buildInstanceStatusSeverity = (
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

const getInstanceStatus = (status: TInstanceStatusDto): TInstanceStatus => ({
  state: status,
  severity: buildInstanceStatusSeverity(status),
});

const getActionHrefByName = (
  projectUrl: string,
  name: TActionName,
  { region, id }: Pick<TInstance, 'id' | 'region'>,
): TInstanceAction['link'] => {
  if (name === 'details') {
    return { path: id, isExternal: false };
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
      path: `region/${region}/instance/${id}/soft-reboot`,
      isExternal: false,
    };
  }

  if (name === 'hard_reboot') {
    return {
      path: `region/${region}/instance/${id}/hard-reboot`,
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
      path: `region/${region}/instance/${id}/${name}`,
      isExternal: false,
    };
  }

  return { path: '', isExternal: false };
};

const mapInstanceActions = (
  instance: TInstanceDto,
  projectUrl: string,
): TInstanceActions =>
  instance.actions.reduce<TInstanceActions>((acc, cur) => {
    const { group, name, enabled } = cur;
    const newAction = {
      label: `pci_instances_list_action_${name}`,
      isDisabled: !enabled,
      link: getActionHrefByName(projectUrl, name, instance),
    };
    const foundAction = acc.get(group);
    if (!foundAction) {
      return acc.set(group, [newAction]);
    }
    return acc.set(group, [...foundAction, newAction]);
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
      addresses: instanceDto.addresses.reduce((acc, { type, ...rest }) => {
        const foundAddresses = acc.get(type);
        const ipAlreadyExists = !!foundAddresses?.find(
          ({ ip }) => ip === rest.ip,
        );
        if (foundAddresses) {
          if (ipAlreadyExists) return acc.set(type, [...foundAddresses]);
          return acc.set(type, [...foundAddresses, rest]);
        }
        return acc.set(type, [rest]);
      }, new Map<TInstanceAddressType, TAddress[]>()),
      actions: mapInstanceActions(instanceDto, projectUrl),
    }));
