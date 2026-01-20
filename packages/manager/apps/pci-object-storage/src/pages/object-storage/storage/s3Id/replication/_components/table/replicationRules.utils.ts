import storages from '@/types/Storages';

export const hasDeletedDestination = (
  rule: storages.ReplicationRule,
): boolean => rule.destination?.region === null;
