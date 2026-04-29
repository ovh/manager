import { TilesInput, useBytes } from '@ovh-ux/manager-pci-common';
import { ReactNode, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { TVolumeModel } from '@/api/hooks/useCatalog';
import { TVolumeRetypeModel } from '@/api/hooks/useCatalogWithPreselection';
import { sortByPreselectedModel } from '@/api/select/catalog';
import { capitalizeFirstLetter } from '@/utils';

type AnyVolumeModel = TVolumeModel | TVolumeRetypeModel;

type Props = {
  volumeModels: AnyVolumeModel[];
  value: AnyVolumeModel | null;
  onChange: (value: AnyVolumeModel) => void;
  label: string;
  locked?: boolean;
  horizontal?: boolean;
  hideBadges?: boolean;
  disabled?: boolean;
};

// ConfigCard's `description` and `features` are typed as plain strings but
// render their content via `{children}` — React accepts any ReactNode at
// runtime. This cast localises the lie to one place.
const asConfigCardSlot = <T,>(node: ReactNode): T => (node as unknown) as T;

const BaseRangeLine = ({ children }: { children: ReactNode }) => (
  <span className="bs-base-range text-xs opacity-70">{children}</span>
);

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

  // Ordered spec lines for one tile. A `null` slot means the model has no
  // value for that line (e.g. no bandwidth, no base-range override).
  const buildSpecLines = useCallback(
    (m: AnyVolumeModel): ReactNode[] => {
      const capacityMax = t(
        'add:pci_projects_project_storages_blocks_add_type_addon_capacity_max',
        { capacity: formatBytes(m.capacity.max) },
      );

      const items: ReactNode[] = [
        m.iops,
        m.iopsBaseRange && (
          <BaseRangeLine key="iops-br">{m.iopsBaseRange}</BaseRangeLine>
        ),
        capacityMax,
        m.bandwidth,
        m.bandwidthBaseRange && (
          <BaseRangeLine key="bw-br">{m.bandwidthBaseRange}</BaseRangeLine>
        ),
      ];
      return items.filter((line) => line != null && line !== false);
    },
    [t, formatBytes],
  );

  const buildZoneText = useCallback(
    (m: AnyVolumeModel) =>
      m.availabilityZonesCount
        ? t(
            'add:pci_projects_project_storages_blocks_add_type_availability_zone',
            { count: m.availabilityZonesCount },
          )
        : undefined,
    [t],
  );

  // Horizontal mode hides ConfigCard's features section, so we render the
  // ticked list inside description ourselves (re-using the same CSS class).
  const buildHorizontalDescription = useCallback(
    (m: AnyVolumeModel): ReactNode => {
      const zoneText = buildZoneText(m);
      const lines = buildSpecLines(m);
      return (
        <>
          {zoneText && <span className="block">{zoneText}</span>}
          <ul className="config-card__features">
            {lines.map((line, i) => (
              <li key={`spec-${m.name}-${i}`}>{line}</li>
            ))}
          </ul>
        </>
      );
    },
    [buildZoneText, buildSpecLines],
  );

  const buildBadges = useCallback(
    (m: AnyVolumeModel) =>
      hideBadges
        ? []
        : [
            {
              label: t(
                `common:pci_projects_project_storages_blocks_encryption_${
                  m.encrypted ? 'available' : 'unavailable'
                }`,
              ),
              backgroundColor: m.encrypted ? '#D2F2C2' : '#FFCCD9',
              textColor: m.encrypted ? '#113300' : '#4D000D',
              icon: 'lock' as const,
            },
          ],
    [hideBadges, t],
  );

  const tiles = useMemo(
    () =>
      sortByPreselectedModel(volumeModels).map((m) => ({
        ...m,
        label: capitalizeFirstLetter(m.displayName),
        badges: buildBadges(m),
        price: m.hourlyPrice,
        ...(horizontal
          ? {
              description: asConfigCardSlot<string>(
                buildHorizontalDescription(m),
              ),
              features: [],
            }
          : {
              description: buildZoneText(m),
              features: asConfigCardSlot<string[]>(buildSpecLines(m)),
            }),
      })),
    [
      volumeModels,
      horizontal,
      buildBadges,
      buildHorizontalDescription,
      buildZoneText,
      buildSpecLines,
    ],
  );

  const selectedTile = useMemo(
    () => tiles.find((tile) => tile.name === value?.name),
    [tiles, value],
  );

  const setTileDisabled = useCallback(
    (tile: typeof tiles[number] & { disabled: boolean }) => {
      // Underlying lib has no disabled prop; mutate per-tile input props.
      // eslint-disable-next-line no-param-reassign
      tile.disabled = disabled;
      return tile;
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
        value={selectedTile}
        elements={tiles}
        onChange={(tile) => onChange(tile as AnyVolumeModel)}
        locked={locked}
        horizontal={horizontal}
        inputProps={setTileDisabled}
      />
    </div>
  );
};
