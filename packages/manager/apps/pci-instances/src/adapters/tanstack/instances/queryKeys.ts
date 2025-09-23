import { Query } from '@tanstack/react-query';
import { instancesQueryKey } from '@/utils';

export const listQueryKeyPredicate = (projectId: string) => (query: Query) =>
  instancesQueryKey(projectId, ['list']).every((elt) =>
    query.queryKey.includes(elt),
  );

export const instanceQueryKey = (
  projectId: string,
  instance: string,
  region: string | null,
): string[] =>
  instancesQueryKey(projectId, [
    'region',
    String(region),
    'instance',
    instance,
    'withBackups',
    'withImage',
    'withNetworks',
    'withVolumes',
  ]);

export const instanceQueryKeyPredicate = (
  projectId: string,
  instanceId: string,
) => (query: Query) =>
  instancesQueryKey(projectId, [
    'region',
    'instance',
    instanceId,
  ]).every((elt) => query.queryKey.includes(elt));
