import { useState, useEffect } from 'react';
import { useProject } from '@ovh-ux/manager-pci-common';
import { VLAN_ID } from '@/pages/new/new.constants';
import { useGetPrivateNetworks } from '@/data/hooks/networks/useNetworks';
import { getNextAvailableVlanId } from '@/utils/utils';

type GetDefaultVlanId = {
  defaultVlanId: number;
  notAvailableIds: number[];
};

export default function useDefaultVlanID(): GetDefaultVlanId {
  const [defaultVlanId, setDefaultVlanId] = useState<number>(VLAN_ID.default);
  const [notAvailableIds, setNotAvailableIds] = useState<number[]>([]);
  const { data: project } = useProject();
  const { data: networks } = useGetPrivateNetworks(project.project_id);

  useEffect(() => {
    const ids = networks?.map((network) => network.vlanId);
    const vlanIds = ids?.filter((id) => !!id);
    const id = getNextAvailableVlanId(vlanIds);

    setNotAvailableIds(vlanIds);
    setDefaultVlanId(id);
  }, [networks]);

  return { defaultVlanId, notAvailableIds };
}
