import { TVolume } from '@/api/hooks/useVolume';
import { TInstance } from '@/entity/instance';

export type TAttachableInstance = Pick<TInstance, 'id' | 'name'>;

function canAttachVolume(
  instance: TInstance,
  availabilityZone: TVolume['availabilityZone'],
): instance is Omit<TInstance, 'status'> & { status: 'ACTIVE' } {
  if (instance.status !== 'ACTIVE') return false;

  return (
    !availabilityZone ||
    availabilityZone === 'any' ||
    instance.availabilityZone === availabilityZone
  );
}

export const selectAttachableInstances = (
  availabilityZone: TVolume['availabilityZone'],
  attachedInstances: TInstance['id'][],
) => (instances: TInstance[]): TAttachableInstance[] =>
  instances
    .filter(
      (i) =>
        canAttachVolume(i, availabilityZone) &&
        !attachedInstances.includes(i.id),
    )
    .map(({ id, name }) => ({
      id,
      name,
    }));

export type TAttachedInstance = Pick<TInstance, 'id' | 'name'>;

export const selectAttachedInstances = (ids: TInstance['id'][]) => (
  instances: TInstance[],
): TAttachedInstance[] => instances.filter(({ id }) => ids.includes(id));
