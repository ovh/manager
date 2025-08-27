import {
  TAggregatedInstanceDto,
  TPartialAggregatedInstanceDto,
} from '@/types/instance/api.type';
import {
  TInstanceAddresses,
  TPartialInstance,
} from '@/types/instance/entity.type';

export const buildPartialInstanceDto = (
  initial: TPartialAggregatedInstanceDto,
) => ({
  with<K extends keyof TAggregatedInstanceDto>(
    key: K,
    value: TAggregatedInstanceDto[K],
  ) {
    return buildPartialInstanceDto({ ...initial, [key]: value });
  },
  build() {
    return initial;
  },
});

const mapAddresses = (addresses: TInstanceAddresses) =>
  Array.from(addresses).flatMap(([type, items]) =>
    items.map((address) => ({
      ip: address.ip,
      version: address.version,
      type,
      gatewayIp: address.subnet?.gatewayIP ?? '',
    })),
  );

export const buildPartialAggregatedInstanceDto = (
  instance: TPartialInstance,
): TPartialAggregatedInstanceDto => {
  const baseAggregatedInstance: TPartialAggregatedInstanceDto = {
    id: instance.id,
  };

  const withName = (dto: TPartialAggregatedInstanceDto) =>
    instance.name ? { ...dto, name: instance.name } : dto;

  const withRegion = (dto: TPartialAggregatedInstanceDto) =>
    instance.region ? { ...dto, region: instance.region.name } : dto;

  const withAddresses = (dto: TPartialAggregatedInstanceDto) =>
    instance.addresses
      ? { ...dto, addresses: mapAddresses(instance.addresses) }
      : dto;

  const withActions = (dto: TPartialAggregatedInstanceDto) =>
    instance.actions ? { ...dto, actions: instance.actions } : dto;

  const withVolumes = (dto: TPartialAggregatedInstanceDto) =>
    instance.volumes
      ? {
          ...dto,
          volumes: instance.volumes.map(({ id, name }) => ({
            id,
            name: name ?? '',
          })),
        }
      : dto;

  const withStatus = (dto: TPartialAggregatedInstanceDto) =>
    instance.status ? { ...dto, status: instance.status } : dto;

  const withPendingTask = (dto: TPartialAggregatedInstanceDto) =>
    instance.task
      ? {
          ...dto,
          pendingTask: instance.task.isPending,
          taskState: instance.task.status ?? '',
        }
      : dto;

  return [
    withName,
    withRegion,
    withAddresses,
    withActions,
    withVolumes,
    withStatus,
    withPendingTask,
  ].reduce((acc, fn) => fn(acc), baseAggregatedInstance);
};
