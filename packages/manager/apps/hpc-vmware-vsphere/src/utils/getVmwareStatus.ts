import { VMWareState, VMWareStatus } from '@/types/vsphere';
import { getCommercialType } from './getCommercialType';
import { CommercialName } from '@/types/datacenter';

type GetVmwareStatusProps = {
  vsphereState: VMWareState;
  datacenterCommercialName: CommercialName;
};

export function getVmwareStatus({
  vsphereState,
  datacenterCommercialName,
}: GetVmwareStatusProps) {
  if (vsphereState === VMWareState.Migrating) {
    return VMWareStatus.MIGRATING;
  }

  if (getCommercialType(datacenterCommercialName) === 'ESSENTIALS') {
    return VMWareStatus.ESSENTIALS;
  }

  if (getCommercialType(datacenterCommercialName) === 'PREMIER') {
    return VMWareStatus.PREMIER;
  }

  return undefined;
}
