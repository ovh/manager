import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { TAddon } from '@ovh-ux/manager-pci-common';

export const HIGHSPEED_V2_PLANCODE = 'volume.high-speed-gen2.consumption';

export function getDisplayUnit(unit: string) {
  const perGB = '/GB';
  if (unit.endsWith(perGB)) {
    return unit.slice(0, unit.lastIndexOf(perGB));
  }
  return unit;
}

export function computeBandwidthToAllocate(capacity: number, addon: TAddon) {
  const { bandwidth } = addon.blobs.technical;
  const allocatedBandwidth = capacity * bandwidth.level;
  const maxBandwidthInMb = bandwidth.max * 1000;

  return allocatedBandwidth <= maxBandwidthInMb
    ? `${allocatedBandwidth} ${getDisplayUnit(bandwidth.unit)}`
    : `${maxBandwidthInMb} ${getDisplayUnit(bandwidth.unit)}`;
}

export function computeIopsToAllocate(capacity: number, addon: TAddon) {
  const { volume } = addon.blobs.technical;
  const allocatedIops = capacity * volume.iops.level;

  return allocatedIops <= volume.iops.max
    ? `${allocatedIops} ${getDisplayUnit(volume.iops.unit)}`
    : `${volume.iops.max} ${volume.iops.maxUnit}`;
}

export interface HighSpeedV2InfosProps {
  volumeCapacity: number;
  volumeType: TAddon;
}

export function HighSpeedV2Infos({
  volumeCapacity,
  volumeType,
}: HighSpeedV2InfosProps) {
  const { t } = useTranslation('add');
  const isHighSpeedV2 = volumeType?.planCode === HIGHSPEED_V2_PLANCODE;
  return (
    isHighSpeedV2 && (
      <div>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_projects_project_storages_blocks_add_size_bandwidth', {
            bandwidth: computeBandwidthToAllocate(volumeCapacity, volumeType),
          })}
        </OsdsText>
        <br />
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_projects_project_storages_blocks_add_size_iops', {
            iops: computeIopsToAllocate(volumeCapacity, volumeType),
          })}
        </OsdsText>
      </div>
    )
  );
}
