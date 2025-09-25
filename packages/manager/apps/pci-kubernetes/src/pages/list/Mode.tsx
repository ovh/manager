import { RegionChipByType } from '@ovh-ux/manager-pci-common';

import { useRegionInformations } from '@/api/hooks/useRegionInformations';

const Mode = ({ projectId, region }: { projectId: string; region: string }) => {
  const { data } = useRegionInformations(projectId ?? '', region);
  return <>{data && <RegionChipByType type={data.type} showTooltip={false} />}</>;
};

export default Mode;
