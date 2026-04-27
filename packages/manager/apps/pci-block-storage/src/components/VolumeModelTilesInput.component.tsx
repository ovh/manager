import { TilesInput, useBytes } from '@ovh-ux/manager-pci-common';
import { ReactNode, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { TVolumeModel } from '@/api/hooks/useCatalog';
import { TVolumeRetypeModel } from '@/api/hooks/useCatalogWithPreselection';
import { sortByPreselectedModel } from '@/api/select/catalog';
import { capitalizeFirstLetter } from '@/utils';

type Props<T = TVolumeModel | TVolumeRetypeModel> = {
  volumeModels: T[];
  value: T | null;
  onChange: (value: T) => void;
  label: string;
  locked?: boolean;
  horizontal?: boolean;
  hideBadges?: boolean;
  disabled?: boolean;
};

export const VolumeModelTilesInput = ({
  volumeModels = [],
  value,
  onChange,
  label = '',
  locked = false,
  horizontal = false,
  hideBadges = false,
  disabled = false,
}: Props) => {
  const { t } = useTranslation(['add', 'common']);
  const { formatBytes } = useBytes();

  type SpecItem = { key: string; text: string; isBaseRange: boolean };

  const buildSpecItems = useCallback(
    (m: TVolumeModel | TVolumeRetypeModel): SpecItem[] => {
      const capacityMax = t(
        'add:pci_projects_project_storages_blocks_add_type_addon_capacity_max',
        {
          capacity: formatBytes(m.capacity.max),
        },
      );

      return [
        { key: `${m.name}-iops`, text: m.iops, isBaseRange: false },
        ...(m.iopsBaseRange
          ? [
              {
                key: `${m.name}-iops-br`,
                text: m.iopsBaseRange,
                isBaseRange: true,
              },
            ]
          : []),
        { key: `${m.name}-cap`, text: capacityMax, isBaseRange: false },
        ...(m.bandwidth
          ? [{ key: `${m.name}-bw`, text: m.bandwidth, isBaseRange: false }]
          : []),
        ...(m.bandwidthBaseRange
          ? [
              {
                key: `${m.name}-bw-br`,
                text: m.bandwidthBaseRange,
                isBaseRange: true,
              },
            ]
          : []),
      ];
    },
    [t, formatBytes],
  );

  const renderBaseRangeText = (text: string): ReactNode => (
    <span className="bs-base-range text-xs opacity-70">{text}</span>
  );

  const renderSpecsList = (items: SpecItem[]): ReactNode => (
    <ul className="config-card__features">
      {items.map(({ key, text, isBaseRange }) => (
        <li key={key}>{isBaseRange ? renderBaseRangeText(text) : text}</li>
      ))}
    </ul>
  );

  const getDescription = useCallback(
    (model: TVolumeModel | TVolumeRetypeModel) => {
      const zoneText = model.availabilityZonesCount
        ? t(
            'add:pci_projects_project_storages_blocks_add_type_availability_zone',
            { count: model.availabilityZonesCount },
          )
        : undefined;

      if (horizontal) {
        // Horizontal mode hides ConfigCard's features section, so we render the
        // ticked spec list inside `description` to match the vertical layout.
        const node = (
          <>
            {zoneText && <span className="block">{zoneText}</span>}
            {renderSpecsList(buildSpecItems(model))}
          </>
        );
        return (node as unknown) as string;
      }

      return zoneText;
    },
    [t, horizontal, buildSpecItems],
  );

  const getFeatures = useCallback(
    (m: TVolumeModel | TVolumeRetypeModel) => {
      if (horizontal) return [];

      const items: ReactNode[] = buildSpecItems(m).map(
        ({ key, text, isBaseRange }) =>
          isBaseRange ? (
            <span key={key} className="bs-base-range text-xs opacity-70">
              {text}
            </span>
          ) : (
            text
          ),
      );

      // ConfigCard's `features` is typed as string[] but renders each entry as
      // `<li>{entry}</li>` — React renders ReactNode children fine. Cast keeps
      // the TS contract honest at the boundary.
      return (items as unknown) as string[];
    },
    [horizontal, buildSpecItems],
  );

  const volumeTypes = useMemo(
    () =>
      sortByPreselectedModel(volumeModels).map((model) => ({
        ...model,
        label: capitalizeFirstLetter(model.displayName),
        description: getDescription(model),
        badges: hideBadges
          ? []
          : [
              {
                label: t(
                  `common:pci_projects_project_storages_blocks_encryption_${
                    model.encrypted ? 'available' : 'unavailable'
                  }`,
                ),
                backgroundColor: model.encrypted ? '#D2F2C2' : '#FFCCD9',
                textColor: model.encrypted ? '#113300' : '#4D000D',
                icon: 'lock' as const,
              },
            ],
        features: getFeatures(model),
        price: model.hourlyPrice,
      })),
    [volumeModels, t, getDescription, getFeatures],
  );

  const volumeTypeValue = useMemo(
    () => volumeTypes?.find((v) => v.name === value?.name),
    [volumeModels, value],
  );

  const disableAllProps = useCallback(
    (e: typeof volumeTypes[number] & { disabled: boolean }) => {
      // We can't directly disable the input tiles. In waiting for changing the lib used, we do this instead.
      // eslint-disable-next-line no-param-reassign
      e.disabled = disabled;
      return e;
    },
    [disabled],
  );

  return (
    <div className={clsx(horizontal && '[&_osds-text]:leading-[130%]')}>
      <Text preset={TEXT_PRESET.heading5} className="mt-4">
        {label}
      </Text>
      <TilesInput
        name="volume-type"
        label={undefined}
        value={volumeTypeValue}
        elements={volumeTypes}
        onChange={(e) => onChange(e)}
        locked={locked}
        horizontal={horizontal}
        inputProps={disableAllProps}
      />
    </div>
  );
};
