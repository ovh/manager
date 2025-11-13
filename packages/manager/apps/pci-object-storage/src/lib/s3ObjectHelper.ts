import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud/index';

export function getTotalVersionsSize(versions: StorageObject[]) {
  return versions.reduce((acc, curr) => acc + curr.size, 0);
}
