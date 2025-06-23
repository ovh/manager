import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  Links,
  LinkType,
  TileBlock,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { RegionChipByType } from '@ovh-ux/manager-pci-common';
import { useHref } from 'react-router-dom';
import DashboardCardLayout from './DashboardCardLayout.component';
import PriceLabel from '@/components/priceLabel/PriceLabel.component';
import { InstanceDetailContext } from '../Instance.page';
import { LoadingCell } from '@/components/datagrid/cell/LoadingCell.component';
import { ActionsMenu } from '@/components/menu/ActionsMenu.component';

const InstanceGeneralDetails: FC = () => {
  const { t } = useTranslation(['dashboard', 'list', 'actions']);
  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { data: instance, isLoading } = useContext(InstanceDetailContext);
  const hrefEditInstance = useHref(`../${instance.id}/edit`);
  const hrefDeleteInstance = useHref('delete');
  const hrefBillingMonthlyActivate = useHref('billing/monthly/activate');

  return (
    <DashboardCardLayout title={t('pci_instances_dashboard_info_title')}>
      <TileBlock label={t('list:pci_instances_list_column_flavor')}>
        <LoadingCell isLoading={isLoading}>
          <div className="flex flex-col">
            <OsdsText
              className="my-4"
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {instance.flavorName}
            </OsdsText>
            {instance.isEditionEnabled && (
              <Links
                label={t('pci_instances_dashboard_upgrade_model')}
                type={LinkType.next}
                href={hrefEditInstance}
              />
            )}
          </div>
        </LoadingCell>
      </TileBlock>
      <TileBlock label={t('list:pci_instances_list_column_region')}>
        <LoadingCell isLoading={isLoading}>
          <OsdsText
            className="mr-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {instance.availabilityZone ?? translateMicroRegion(instance.region)}
          </OsdsText>
          <RegionChipByType type={instance.regionType} showTooltip={false} />
        </LoadingCell>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_memory_title')}>
        <LoadingCell isLoading={isLoading}>
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {instance.flavorRam}
          </OsdsText>
        </LoadingCell>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_processor_title')}>
        <LoadingCell isLoading={isLoading}>
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('pci_instances_dashboard_cpu_value', {
              cpu: instance.flavorCpu,
            })}
          </OsdsText>
        </LoadingCell>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_price_title')}>
        <LoadingCell isLoading={isLoading}>
          <div className="flex flex-col">
            <div>
              {instance.prices.map(({ value, type, label }) => (
                <div className="my-4" key={type}>
                  <OsdsText
                    size={ODS_TEXT_SIZE._400}
                    level={ODS_TEXT_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {t(label)}
                  </OsdsText>
                  <PriceLabel key={type} value={value} type={type} />
                </div>
              ))}
            </div>
            {instance.standaloneActions.includes(
              'activate_monthly_billing',
            ) && (
              <Links
                label={t(
                  'actions:pci_instances_actions_billing_monthly_activate_instance_title',
                )}
                type={LinkType.next}
                href={hrefBillingMonthlyActivate}
              />
            )}
          </div>
        </LoadingCell>
      </TileBlock>
      <TileBlock>
        <LoadingCell isLoading={isLoading}>
          <div className="flex justify-between items-center">
            <OsdsText
              className="my-4"
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {t('pci_instances_dashboard_all_actions')}
            </OsdsText>
            <ActionsMenu items={instance.actions} />
          </div>
        </LoadingCell>
      </TileBlock>
      {instance.standaloneActions.includes('delete') && (
        <LoadingCell isLoading={isLoading}>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.error}
            href={hrefDeleteInstance}
          >
            {t('list:pci_instances_list_action_delete')}
          </OsdsLink>
        </LoadingCell>
      )}
    </DashboardCardLayout>
  );
};

export default InstanceGeneralDetails;
