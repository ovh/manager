import { TilesInput, useBytes } from '@ovh-ux/manager-pci-common';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { TVolumeModel } from '@/api/hooks/useCatalog';
import { TVolumeRetypeModel } from '@/api/hooks/useCatalogWithPreselection';

type Props<T = TVolumeModel | TVolumeRetypeModel> = {
  volumeModels: T[];
  value: T | null;
  onChange: (value: T) => void;
  label: string;
  locked?: boolean;
  horizontal?: boolean;
};

export const VolumeModelTilesInput = ({
  volumeModels = [],
  value,
  onChange,
  label = '',
  locked = false,
  horizontal = false,
}: Props) => {
  const { t } = useTranslation(['add', 'common']);
  const { formatBytes } = useBytes();

  const getDescription = useCallback(
    (model: TVolumeModel | TVolumeRetypeModel) => {
      const zoneText = model.availabilityZonesCount
        ? t(
            'add:pci_projects_project_storages_blocks_add_type_availability_zone',
            { count: model.availabilityZonesCount },
          )
        : undefined;

      const capacityMax = t(
        'add:pci_projects_project_storages_blocks_add_type_addon_capacity_max',
        {
          capacity: formatBytes(model.capacity.max),
        },
      );

      if (horizontal) {
        const zoneDescription = zoneText ? `${zoneText}.\n` : '';
        return `${zoneDescription}${model.iops}, ${capacityMax}`;
      }

      return zoneText;
    },
    [t, formatBytes],
  );

  const getFeatures = useCallback(
    (m: TVolumeModel | TVolumeRetypeModel) => {
      if (horizontal) return [];

      return [
        m.iops,
        t(
          'add:pci_projects_project_storages_blocks_add_type_addon_capacity_max',
          {
            capacity: formatBytes(m.capacity.max),
          },
        ),
        ...(m.bandwidth ? [m.bandwidth] : []),
      ];
    },
    [t, formatBytes],
  );

  const volumeTypes = useMemo(
    () =>
      volumeModels.map((m) => ({
        ...m,
        label: m.displayName,
        description: getDescription(m),
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
        features: getFeatures(m),
        price: m.hourlyPrice,
      })),
    [volumeModels, t, getDescription, getFeatures],
  );

  const volumeTypeValue = useMemo(
    () => volumeTypes?.find((v) => v.name === value?.name),
    [volumeModels, value],
  );

  return (
    <div
      className={clsx(
        horizontal && '[&_.config-card\\_\\_badges]:w-full whitespace-pre-line',
      )}
    >
      <TilesInput
        name="volume-type"
        label={label}
        value={volumeTypeValue}
        elements={volumeTypes}
        onChange={(e) => onChange(e)}
        locked={locked}
        horizontal={horizontal}
      />
    </div>
  );
};
