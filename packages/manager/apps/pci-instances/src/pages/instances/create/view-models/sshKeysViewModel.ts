import { Deps } from '@/deps/deps';
import { TSshKey } from '@/domain/entities/configuration';
import { Reader } from '@/types/utils.type';

export type TSshKeyData = {
  label: string;
  value: string;
};

type TSshKeysSelectData = (
  projectId: string,
  microRegion: string,
) => TSshKeyData[];

const mapSshKeysData = (sshKeys: TSshKey[]): TSshKeyData[] =>
  sshKeys.map(({ id, name }) => ({ label: name, value: id }));

export const selectSshKeys: Reader<Deps, TSshKeysSelectData> = (deps) => (
  projectId,
  microRegion,
) => {
  const { configurationPort } = deps;

  const sshKeys = configurationPort.selectSshKeys(projectId, microRegion) ?? [];

  return mapSshKeysData(sshKeys);
};
