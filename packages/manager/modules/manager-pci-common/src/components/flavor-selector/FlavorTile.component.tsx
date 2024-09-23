import React from 'react';
import {
  OsdsChip,
  OsdsLink,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_CHIP_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  useCatalogPrice,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useBytes, useNumberFormat } from '../../hooks';
import { FlavorLocalzoneChip } from './FlavorLocalzoneChip';

export interface FlavorDiskType {
  number: number;
  capacity: number;
  sizeUnit: string;
  technology: string;
}

export interface FlavorTileProps {
  flavorName: string;
  flavorSpecs: {
    ram: number;
    vcores: number;
    frequency: number;
    disk: FlavorDiskType[];
    nvme: FlavorDiskType[];
    bandwidth: number;
    gpuNumber: number;
    gpuModel: string;
  };
  flavorCompatibility: {
    localzone: boolean;
    globalzone: boolean;
  };
  flavorPrice: {
    hourly: number;
    monthly?: number;
  };
  isNewFlavor: boolean;
  isSelected: boolean;
  hasEnoughQuota?: boolean;
  onClick: () => void;
}

const checkedClass =
  'cursor-pointer font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]';
const uncheckedClass =
  'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]';
const separatorClass = 'h-px my-5 bg-[#85d9fd] border-0';
const gigabytes = 10 ** 9;

export function FlavorTile({
  flavorName,
  flavorSpecs,
  flavorCompatibility,
  flavorPrice,
  isNewFlavor,
  isSelected,
  hasEnoughQuota,
  onClick,
}: Readonly<FlavorTileProps>) {
  const { t } = useTranslation('pci-flavors');
  const { formatBytes } = useBytes();
  const { formatNumber } = useNumberFormat();
  const { getTextPrice, getFormattedHourlyCatalogPrice } = useCatalogPrice(4, {
    exclVat: true,
  });
  const projectHref = useProjectUrl('public-cloud');
  return (
    <OsdsTile
      className={clsx(
        isSelected ? checkedClass : uncheckedClass,
        !hasEnoughQuota && 'opacity-50',
      )}
      checked={isSelected}
      onClick={() => hasEnoughQuota && onClick?.()}
    >
      <div className="w-full">
        <div className="flex justify-between">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            <span className={clsx(isSelected && 'font-bold')}>
              {flavorName}
            </span>
          </OsdsText>
          {isNewFlavor && (
            <OsdsChip
              color={ODS_THEME_COLOR_INTENT.info}
              size={ODS_CHIP_SIZE.sm}
              inline
            >
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.primary}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._500}
              >
                {t('pci_project_flavors_category_new')}
              </OsdsText>
            </OsdsChip>
          )}
        </div>
        <hr className={separatorClass} />
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_project_flavors_spec_ram', { ram: `${flavorSpecs.ram} GB` })}
        </OsdsText>
        <OsdsText
          className="block"
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_project_flavors_spec_vCore_details', {
            vcores: flavorSpecs.vcores,
            frequency: flavorSpecs.frequency,
          })}
        </OsdsText>
        {flavorSpecs.disk?.map((disk, index) => (
          <OsdsText
            key={index}
            className="block"
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {disk.number > 1 ? `${disk.number} x ` : ''}
            {`${formatBytes(disk.capacity * gigabytes, 2)}`}
            {` ${disk.technology}`}
          </OsdsText>
        ))}
        {flavorSpecs.nvme?.map((disk, index) => (
          <OsdsText
            key={index}
            className="block"
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {disk.number > 1 ? `${disk.number} x ` : ''}
            {`${formatBytes(disk.capacity * gigabytes, 2)}`}
            {` NVMe`}
          </OsdsText>
        ))}
        <OsdsText
          className="block"
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_project_flavors_spec_bandwidth_detail', {
            bandwidth: formatNumber(flavorSpecs.bandwidth),
          })}
        </OsdsText>
        <OsdsText
          className="block"
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {flavorSpecs.gpuNumber > 1 ? `${flavorSpecs.gpuNumber}x ` : ''}
          {flavorSpecs.gpuModel}
        </OsdsText>
        <hr className={separatorClass} />
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._200}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_project_flavors_zone_compatible')}
        </OsdsText>
        <div className="flex gap-4 mt-3">
          {flavorCompatibility.localzone && <FlavorLocalzoneChip isLocalZone />}
          {flavorCompatibility.globalzone && (
            <FlavorLocalzoneChip isLocalZone={false} />
          )}
        </div>
        <hr className={separatorClass} />
        {flavorPrice.monthly && (
          <OsdsText
            className="block"
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('pci_project_flavors_price_monthly', {
              price: getTextPrice(flavorPrice.monthly),
            })}
          </OsdsText>
        )}
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {getFormattedHourlyCatalogPrice(flavorPrice.hourly)}
        </OsdsText>
        {!hasEnoughQuota && (
          <>
            <hr className={separatorClass} />
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              color={ODS_THEME_COLOR_INTENT.error}
            >
              {t('pci_project_flavors_quota_info')}
            </OsdsText>
            <OsdsLink
              className="ml-3"
              color={ODS_THEME_COLOR_INTENT.primary}
              href={`${projectHref}/quota`}
            >
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                color={ODS_THEME_COLOR_INTENT.primary}
              >
                {t('pci_project_flavors_quota_manage')}
              </OsdsText>
            </OsdsLink>
          </>
        )}
      </div>
    </OsdsTile>
  );
}
