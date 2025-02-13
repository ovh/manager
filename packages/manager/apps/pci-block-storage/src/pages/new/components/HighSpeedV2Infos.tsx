import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { TVolumeAddon, TVolumePricing } from '@/api/data/catalog';

export const HIGHSPEED_V2_PLANCODE = 'high-speed-gen2';

export function getDisplayUnit(unit: string) {
  const perGB = '/GB';
  if (unit.endsWith(perGB)) {
    return unit.slice(0, unit.lastIndexOf(perGB));
  }
  return unit;
}

export function computeBandwidthToAllocate(
  capacity: number,
  pricing: TVolumePricing,
) {
  const { bandwidth } = pricing.specs;
  const allocatedBandwidth = capacity * bandwidth.level;
  const maxBandwidthInMb = bandwidth.max * 1000;

  return allocatedBandwidth <= maxBandwidthInMb
    ? `${allocatedBandwidth} ${getDisplayUnit(bandwidth.unit)}`
    : `${maxBandwidthInMb} ${getDisplayUnit(bandwidth.unit)}`;
}

export function computeIopsToAllocate(
  capacity: number,
  pricing: TVolumePricing,
) {
  const { volume } = pricing.specs;
  const allocatedIops = capacity * volume.iops.level;

  return allocatedIops <= volume.iops.max
    ? `${allocatedIops} ${getDisplayUnit(volume.iops.unit)}`
    : `${volume.iops.max} ${volume.iops.maxUnit}`;
}

export interface HighSpeedV2InfosProps {
  volumeCapacity: number;
  volumeType: TVolumeAddon;
  pricing: TVolumePricing;
}

export function HighSpeedV2Infos({
  volumeCapacity,
  volumeType,
  pricing,
}: HighSpeedV2InfosProps) {
  const { t } = useTranslation('add');
  const isHighSpeedV2 = volumeType.name === HIGHSPEED_V2_PLANCODE;
  return (
    isHighSpeedV2 && (
      <div>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_projects_project_storages_blocks_add_size_bandwidth', {
            bandwidth: computeBandwidthToAllocate(volumeCapacity, pricing),
          })}
        </OsdsText>
        <br />
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_projects_project_storages_blocks_add_size_iops', {
            iops: computeIopsToAllocate(volumeCapacity, pricing),
          })}
        </OsdsText>
      </div>
    )
  );
}
