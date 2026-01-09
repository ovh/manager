import { TSshKey } from '@/domain/entities/configuration';

export type TSshKeyData = { label: string; value: string };

export const selectSshKeys = (sshKeys?: TSshKey[]): TSshKeyData[] =>
  sshKeys?.map(({ id, name }) => ({ label: name, value: id })) ?? [];
