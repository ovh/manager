import {
  TAggregatedInstanceDto,
  TPartialAggregatedInstanceDto,
} from '@/types/instance/api.type';
import { TPartialInstance } from '@/types/instance/entity.type';

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

export const buildPartialInstanceFromInstancesDto = (
  dto: TPartialAggregatedInstanceDto,
): TPartialInstance => {
  const baseInstance: TPartialInstance = { id: dto.id };

  const withName = (instance: TPartialInstance) =>
    dto.name ? { ...instance, name: dto.name } : instance;

  const withRegion = (instance: TPartialInstance) =>
    dto.region
      ? {
          ...instance,
          region: {
            name: dto.region,
            type: '',
            availabilityZone: dto.availabilityZone ?? null,
          },
        }
      : instance;

  const withStatus = (instance: TPartialInstance) =>
    dto.status ? { ...instance, status: dto.status } : instance;

  const withTask = (instance: TPartialInstance) =>
    dto.pendingTask !== undefined
      ? {
          ...instance,
          task: {
            status: dto.taskState ?? null,
            isPending: dto.pendingTask,
          },
        }
      : instance;

  const withActions = (instance: TPartialInstance) =>
    dto.actions ? { ...instance, actions: dto.actions } : instance;

  const withVolumes = (instance: TPartialInstance) =>
    dto.volumes
      ? {
          ...instance,
          volumes: dto.volumes.map((volume) => ({
            ...volume,
            size: null,
          })),
        }
      : instance;

  return [
    withName,
    withRegion,
    withStatus,
    withTask,
    withActions,
    withVolumes,
  ].reduce((acc, fn) => fn(acc), baseInstance);
};
