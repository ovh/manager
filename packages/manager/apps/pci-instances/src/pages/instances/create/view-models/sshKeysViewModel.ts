import { TSshKey } from '@/domain/entities/configuration';

export type TSshKeyData = { label: string; value: string };

/**
 * Pure transformation function to use as `select` option in useQuery.
 * Transforms SSH keys from domain entities to display data.
 */
export const selectSshKeys = (sshKeys?: TSshKey[]): TSshKeyData[] =>
  sshKeys?.map(({ id, name }) => ({ label: name, value: id })) ?? [];
