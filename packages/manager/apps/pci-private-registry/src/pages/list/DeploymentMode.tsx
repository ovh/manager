import {
  RegionChipByType,
  useProjectLocalisation,
} from '@ovh-ux/manager-pci-common';

const DeploymentType = ({
  region,
  projectId,
}: {
  region: string;
  projectId: string;
}) => {
  const { data: localisations } = useProjectLocalisation(projectId);
  const actualRegionType = localisations?.regions.find((r) => r.name === region)
    ?.type;
  return actualRegionType ? (
    <RegionChipByType showTooltip={false} type={actualRegionType} />
  ) : null;
};

export default DeploymentType;
