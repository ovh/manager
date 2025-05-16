import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Links, LinkType, TileBlock } from '@ovh-ux/manager-react-components';
import { RegionChipByType } from '@ovh-ux/manager-pci-common';
import DashboardCardLayout from './DashboardCardLayout.component';

const Information: FC = () => {
  const { t } = useTranslation(['dashboard', 'list', 'actions']);

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
            b44
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
            Manchester (EU-WEST-LZ-MNC-A)
          </OsdsText>
          <RegionChipByType type="region" showTooltip={false} />
        </div>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_memory_title')}>
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          30 Go
        </OsdsText>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_processor_title')}>
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          8 vCores
        </OsdsText>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_price_title')}>
        <div className="flex flex-col">
          <OsdsText
            className="my-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            0.261 € HT/heure
          </OsdsText>
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

export default Information;
