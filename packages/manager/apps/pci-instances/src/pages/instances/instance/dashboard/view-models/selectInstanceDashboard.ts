import { TInstance, TInstanceAction } from '@/types/instance/entity.type';

export type TInstanceDashboardViewModel = {
  id: string;
  name: string;
  isEditEnabled: boolean;
} | null;

const isEditionEnabled = (actions: TInstanceAction[]) =>
  actions.some(({ name }) => name === 'edit');

export const selectInstanceDashboard = (
  instance?: TInstance,
): TInstanceDashboardViewModel => {
  if (!instance) return null;

  return {
    id: instance.id,
    name: instance.name,
    isEditEnabled: isEditionEnabled(instance.actions),
  };
};
