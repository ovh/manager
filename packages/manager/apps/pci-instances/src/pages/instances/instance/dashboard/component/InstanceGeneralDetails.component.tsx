import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  Links,
  LinkType,
  TileBlock,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { RegionChipByType, TRegionType } from '@ovh-ux/manager-pci-common';
import DashboardCardLayout from './DashboardCardLayout.component';
import { TInstancePrice } from '@/types/instance/entity.type';
import PriceLabel from '@/components/priceLabel/PriceLabel.component';

const InstanceGeneralDetails: FC<{
  flavorName: string;
  availabilityZone: string | null;
  region: string;
  regionType: TRegionType;
  memory: number;
  cpu: number;
  prices: TInstancePrice[];
}> = ({
  flavorName,
  availabilityZone,
  region,
  regionType,
  cpu,
  memory,
  prices,
}) => {
  const { t } = useTranslation(['dashboard', 'list', 'actions']);
  const { translateMicroRegion } = useTranslatedMicroRegions();

  return (
    <DashboardCardLayout title={t('pci_instances_dashboard_info_title')}>
      <TileBlock label={t('list:pci_instances_list_column_flavor')}>
        <div className="flex flex-col">
          <OsdsText
            className="my-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {flavorName}
          </OsdsText>
          <Links
            label={t('pci_instances_dashboard_upgrade_model')}
            type={LinkType.next}
          />
        </div>
      </TileBlock>
      <TileBlock label={t('list:pci_instances_list_column_region')}>
        <div>
          <OsdsText
            className="mr-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {availabilityZone ?? translateMicroRegion(region)}
          </OsdsText>
          <RegionChipByType type={regionType} showTooltip={false} />
        </div>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_memory_title')}>
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {memory}
        </OsdsText>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_processor_title')}>
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_instances_dashboard_cpu_value', { cpu })}
        </OsdsText>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_price_title')}>
        <div className="flex flex-col">
          {prices.map(({ value, type }, key) => (
            <PriceLabel key={key} value={value} type={type} />
          ))}
          <Links
            label={t(
              'actions:pci_instances_actions_billing_monthly_activate_instance_title',
            )}
            type={LinkType.next}
          />
        </div>
      </TileBlock>
    </DashboardCardLayout>
  );
};

export default InstanceGeneralDetails;
