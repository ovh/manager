import { TilesInput, useBytes } from '@ovh-ux/manager-pci-common';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TVolumeModel } from '@/api/hooks/useCatalog';
import { TVolumeRetypeModel } from '@/api/hooks/useCatalogWithPreselection';

type Props<T = TVolumeModel | TVolumeRetypeModel> = {
  volumeModels: T[];
  value: T | null;
  onChange: (value: T) => void;
  label: string;
  locked?: boolean;
};

export const VolumeModelTilesInput = ({
  volumeModels = [],
  value,
  onChange,
  label = '',
  locked = false,
}: Props) => {
  const { t } = useTranslation(['add', 'common']);
  const { formatBytes } = useBytes();

  const volumeTypes = useMemo(
    () =>
      volumeModels.map((m) => ({
        ...m,
        label: m.displayName,
        description:
          m.availabilityZonesCount !== null
            ? t(
                'add:pci_projects_project_storages_blocks_add_type_availability_zone',
                { count: m.availabilityZonesCount },
              )
            : undefined,
        badges: [
          m.encrypted
            ? {
                label: t(
                  'common:pci_projects_project_storages_blocks_encryption_available',
                ),
                backgroundColor: '#D2F2C2',
                textColor: '#113300',
                icon: 'lock' as const,
              }
            : {
                label: t(
                  'common:pci_projects_project_storages_blocks_encryption_unavailable',
                ),
                backgroundColor: '#FFCCD9',
                textColor: '#4D000D',
                icon: 'lock' as const,
              },
        ],
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
      })),
    [volumeModels, t, formatBytes],
  );

  const volumeTypeValue = useMemo(
    () => volumeTypes?.find((v) => v.name === value?.name),
    [volumeModels, value],
  );

  return (
    <TilesInput
      name="volume-type"
      label={label}
      value={volumeTypeValue}
      elements={volumeTypes}
      onChange={(e) => onChange(e)}
      locked={locked}
    />
  );
};
