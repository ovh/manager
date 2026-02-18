import { TSshKey } from '@/domain/entities/configuration';
import { TMicroRegion } from '@/domain/entities/instancesCatalog';

export type TSshKeyData = { label: string; value: string };

const getOnlySSHKeysMatchingSelectedRegion = (
  shKeys: TSshKey[],
  microRegion: string,
) => shKeys.filter(({ regions }) => regions.includes(microRegion));

export const selectSshKeys = (microRegion: TMicroRegion | undefined) => {
  return (sshKeys?: TSshKey[]): TSshKeyData[] => {
    if (!sshKeys || !microRegion) return [];

    const keys = microRegion.isActivated
      ? getOnlySSHKeysMatchingSelectedRegion(sshKeys, microRegion.name)
      : sshKeys;

    return keys.map(({ name }) => ({ label: name, value: name }));
  };
};
