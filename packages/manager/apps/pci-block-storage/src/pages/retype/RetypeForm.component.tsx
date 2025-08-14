import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TilesInput, useBytes } from '@ovh-ux/manager-pci-common';
import { useVolumeModels } from '@/api/hooks/useCatalog';

type RetypeFormComponentParams = {
  projectId: string;
  volumeRegion: string;
};

export const RetypeFormComponent: React.FC<RetypeFormComponentParams> = ({
  projectId,
  volumeRegion,
}: RetypeFormComponentParams) => {
  const { t } = useTranslation(['stepper', 'add', 'common']);
  const { formatBytes } = useBytes();
  const { data } = useVolumeModels(projectId, volumeRegion);

  const [newVolumeType] = useState<typeof volumeTypes[number]>(undefined);

  const volumeTypes = useMemo(
    () =>
      data?.map((m) => ({
        ...m,
        label: m.displayName,
        description:
          m.availabilityZonesCount !== null
            ? t(
                'add:pci_projects_project_storages_blocks_add_type_availability_zone',
                { count: m.availabilityZonesCount },
              )
            : undefined,
        features: [
          m.iops,
          t(
            'add:pci_projects_project_storages_blocks_add_type_addon_capacity_max',
            {
              capacity: formatBytes(m.capacity.max),
            },
          ),
        ].concat(m.bandwidth ? [m.bandwidth] : []),
        price: m.hourlyPrice,
      })) || [],
    [data],
  );

  console.info({ volumeTypes });

  return (
    <TilesInput
      name="volume-type"
      label=""
      value={newVolumeType}
      elements={volumeTypes}
      onChange={(e) => console.info(e)}
    />
  );
};

export default RetypeFormComponent;
