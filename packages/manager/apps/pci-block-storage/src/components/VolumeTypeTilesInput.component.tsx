import { TilesInput, useBytes } from '@ovh-ux/manager-pci-common';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TVolumeModel } from '@/api/hooks/useCatalog';

type Props = {
  data?: TVolumeModel[];
  value?: TVolumeModel;
  onChange: (value: TVolumeModel) => void;
  label?: string;
  locked?: boolean;
};

export const VolumeTypeTilesInput = ({
  data = [],
  value,
  onChange,
  label = '',
  locked = false,
}: Props) => {
  const { t } = useTranslation(['add', 'common']);
  const { formatBytes } = useBytes();

  const addDisplayInformation = useCallback(
    (m: TVolumeModel) => ({
      model: m,
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
    }),
    [t, formatBytes],
  );

  const volumeTypes = useMemo(() => data.map(addDisplayInformation), [data]);
  const volumeTypeValue = value && addDisplayInformation(value);

  return (
    <TilesInput
      name="volume-type"
      label={label}
      value={volumeTypeValue}
      elements={volumeTypes}
      onChange={(e) => onChange(e.model)}
      locked={locked}
    />
  );
};
