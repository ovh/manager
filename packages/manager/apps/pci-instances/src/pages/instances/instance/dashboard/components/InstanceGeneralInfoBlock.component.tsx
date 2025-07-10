import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  Clipboard,
  Links,
  LinkType,
  TileBlock,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { RegionChipByType } from '@ovh-ux/manager-pci-common';
import DashboardCardLayout from './DashboardCardLayout.component';
import PriceLabel from '@/components/priceLabel/PriceLabel.component';
import { LoadingCell } from '@/pages/instances/datagrid/components/cell/LoadingCell.component';
import { useDashboard } from '../hooks/useDashboard';
import { useParams } from '@/hooks/params/useParams';
import { useDashboardPolling } from '../hooks/useDashboardPolling';
import { TaskStatus } from '@/pages/instances/task/TaskStatus.component';

const InstanceGeneralInfoBlock: FC = () => {
  const { t } = useTranslation(['dashboard', 'list', 'actions']);
  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { regionId, instanceId } = useParams('regionId', 'instanceId');
  const hrefEditInstance = useHref(`../${instanceId}/edit`);
  const hrefBillingMonthlyActivate = useHref('action/billing/monthly/activate');

  const { instance, isPending: isInstanceLoading } = useDashboard({
    region: regionId,
    instanceId,
  });

  const pendingTask = instance?.task.isPending
    ? { region: regionId, instanceId }
    : null;
  const polling = useDashboardPolling(pendingTask);

  return (
    <DashboardCardLayout title={t('pci_instances_dashboard_info_title')}>
      <TileBlock label={t('pci_instances_dashboard_id_openstack_title')}>
        <LoadingCell isLoading={isInstanceLoading}>
          <Clipboard value={instance?.id || ''} />
        </LoadingCell>
      </TileBlock>
      <TileBlock label={t('list:pci_instances_list_column_flavor')}>
        <LoadingCell isLoading={isInstanceLoading}>
          <div className="flex flex-col">
            <OsdsText
              className="my-4"
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {instance?.flavor.name}
            </OsdsText>
            {instance?.isEditEnabled && (
              <Links
                label={t('pci_instances_dashboard_upgrade_model')}
                type={LinkType.next}
                href={hrefEditInstance}
              />
            )}
          </div>
        </LoadingCell>
      </TileBlock>
      {instance && (
        <TileBlock label={t('list:pci_instances_list_column_status')}>
          <TaskStatus
            isLoading={isInstanceLoading}
            isPolling={polling.length > 0}
            taskState={instance.task.status}
            status={instance.status}
          />
        </TileBlock>
      )}
      <TileBlock label={t('list:pci_instances_list_column_region')}>
        <LoadingCell isLoading={isInstanceLoading}>
          <OsdsText
            className="mr-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {instance?.region.availabilityZone ??
              translateMicroRegion(instance?.region.name || '')}
          </OsdsText>
          {instance && (
            <RegionChipByType type={instance.region.type} showTooltip={false} />
          )}
        </LoadingCell>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_memory_title')}>
        <LoadingCell isLoading={isInstanceLoading}>
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {instance?.flavor.ram}
          </OsdsText>
        </LoadingCell>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_processor_title')}>
        <LoadingCell isLoading={isInstanceLoading}>
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('pci_instances_dashboard_cpu_value', {
              cpu: instance?.flavor.cpu,
            })}
          </OsdsText>
        </LoadingCell>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_price_title')}>
        <LoadingCell isLoading={isInstanceLoading}>
          <div className="flex flex-col">
            <div>
              {instance?.pricings.map(({ value, type, label }) => (
                <div className="my-4" key={type}>
                  <OsdsText
                    size={ODS_TEXT_SIZE._400}
                    level={ODS_TEXT_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {t(`pci_instances_dashboard_${label}_price_label`)}
                  </OsdsText>
                  <PriceLabel value={value} type={type} />
                </div>
              ))}
            </div>
            {instance?.canActivateMonthlyBilling && (
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
        <LoadingCell isLoading={isInstanceLoading}>
          <div className="flex justify-between items-center">
            <OsdsText
              className="my-4"
              size={ODS_TEXT_SIZE._100}
              level={ODS_TEXT_LEVEL.subheading}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {t('pci_instances_dashboard_all_actions')}
            </OsdsText>
          </div>
        </LoadingCell>
      </TileBlock>
      <LoadingCell isLoading={isInstanceLoading}>
        <OsdsLink color={ODS_THEME_COLOR_INTENT.error}>
          {t('list:pci_instances_list_action_delete')}
        </OsdsLink>
      </LoadingCell>
    </DashboardCardLayout>
  );
};

export default InstanceGeneralInfoBlock;
