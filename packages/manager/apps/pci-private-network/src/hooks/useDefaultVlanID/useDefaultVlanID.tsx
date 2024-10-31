import { useMemo } from 'react';
import { useProject } from '@ovh-ux/manager-pci-common';
import { VLAN_ID } from '@/pages/new/new.constants';
import { usePrivateNetworks } from '@/data/hooks/networks/useNetworks';
import { getNextAvailableVlanId } from '@/utils/utils';

type GetDefaultVlanId = {
  defaultVlanId: number;
  notAvailableIds: number[];
};

export default function useDefaultVlanID(): GetDefaultVlanId {
  const { data: project } = useProject();
  const { data: networks } = usePrivateNetworks(project.project_id);

  return useMemo(() => {
    const ids = networks?.map((network) => network.vlanId);
    const vlanIds = ids?.filter((id) => !!id) || [];
    const id = getNextAvailableVlanId(vlanIds) || VLAN_ID.default;

    return { defaultVlanId: id, notAvailableIds: vlanIds };
  }, [networks]);
}
