import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  useCatalogPrice,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  OdsBadge,
  OdsCard,
  OdsLink,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BADGE_COLOR,
  ODS_BADGE_SIZE,
  ODS_LINK_COLOR,
} from '@ovhcloud/ods-components';
import { useBytes } from '../../hooks';
import { FlavorLocalzoneChip } from './FlavorLocalzoneChip';
import { selectableTileClass, selectedTileClass } from '../../constants/style';

export interface FlavorDiskType {
  number: number;
  capacity: number;
  sizeUnit: string;
  technology: string;
}

export interface FlavorTileProps {
  id: string;
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

const separatorClass = 'h-px my-5 bg-[#85d9fd] border-0';
const gigabytes = 10 ** 9;

export function FlavorTile({
  id,
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
  const { getTextPrice, getFormattedHourlyCatalogPrice } = useCatalogPrice(4, {
    exclVat: true,
  });
  const projectHref = useProjectUrl('public-cloud');
  return (
    <OdsCard
      className={clsx(
        isSelected ? selectedTileClass : selectableTileClass,
        !hasEnoughQuota && 'opacity-50',
      )}
      onClick={() => hasEnoughQuota && onClick?.()}
    >
      <div className="w-full">
        <div className="flex justify-between">
          <OdsText preset="span">
            <span className={clsx(isSelected && 'font-bold')}>
              {flavorName}
            </span>
          </OdsText>
          {isNewFlavor && (
            <OdsBadge
              label={t('pci_project_flavors_category_new')}
              color={ODS_BADGE_COLOR.information}
              size={ODS_BADGE_SIZE.sm}
              className="text-[--ods-color-primary-500] text-[16px] font-bold"
            />
          )}
        </div>
        <hr className={separatorClass} />
        <OdsText preset="span" className="text-[14px]">
          {t('pci_project_flavors_spec_ram', { ram: `${flavorSpecs.ram} GB` })}
        </OdsText>
        <OdsText preset="span" className="block text-[14px]">
          {t('pci_project_flavors_spec_vCore_details', {
            vcores: flavorSpecs.vcores,
            frequency: flavorSpecs.frequency,
          })}
        </OdsText>
        {flavorSpecs.disk?.map((disk, index) => (
          <OdsText key={index} preset="span" className="block text-[14px]">
            {disk.number > 1 ? `${disk.number} x ` : ''}
            {`${formatBytes(disk.capacity * gigabytes, 2)}`}
            {` ${disk.technology}`}
          </OdsText>
        ))}
        {flavorSpecs.nvme?.map((disk, index) => (
          <OdsText key={index} preset="span" className="block text-[14px]">
            {disk.number > 1 ? `${disk.number} x ` : ''}
            {`${formatBytes(disk.capacity * gigabytes, 2)}`}
            {` NVMe`}
          </OdsText>
        ))}
        <OdsText preset="span" className="block text-[14px]">
          {t('pci_project_flavors_spec_bandwidth_detail', {
            bandwidth: flavorSpecs.bandwidth,
          })}
        </OdsText>
        <OdsText preset="span" className="block text-[14px]">
          {flavorSpecs.gpuNumber > 1 ? `${flavorSpecs.gpuNumber}x ` : ''}
          {flavorSpecs.gpuModel}
        </OdsText>
        <hr className={separatorClass} />
        <OdsText preset="span" className="text-[14px] font-bold">
          {t('pci_project_flavors_zone_compatible')}
        </OdsText>
        <div className="flex gap-4 mt-3">
          {flavorCompatibility.localzone && (
            <FlavorLocalzoneChip isLocalZone id={`popover-localzone-${id}`} />
          )}
          {flavorCompatibility.globalzone && (
            <FlavorLocalzoneChip
              isLocalZone={false}
              id={`popover-globalzone-${id}`}
            />
          )}
        </div>
        <hr className={separatorClass} />
        {flavorPrice.monthly && (
          <OdsText preset="span" className="block text-[14px] font-bold">
            {t('pci_project_flavors_price_monthly', {
              price: getTextPrice(flavorPrice.monthly),
            })}
          </OdsText>
        )}
        <OdsText preset="span" className="text-[14px]">
          {getFormattedHourlyCatalogPrice(flavorPrice.hourly)}
        </OdsText>
        {!hasEnoughQuota && (
          <>
            <hr className={separatorClass} />
            <OdsText
              preset="span"
              className="text-[--ods-color-critical-500] text-[14px]"
            >
              {t('pci_project_flavors_quota_info')}
            </OdsText>
            <OdsLink
              className="ml-3 text-[14px] "
              color={ODS_LINK_COLOR.primary}
              href={`${projectHref}/quota`}
              label={t('pci_project_flavors_quota_manage')}
            />
          </>
        )}
      </div>
    </OdsCard>
  );
}
