import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
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
import {
  Clipboard,
  ClipboardControl,
  ClipboardTrigger,
} from '@ovhcloud/ods-react';
import DashboardCardLayout from './DashboardCardLayout.component';
import PriceLabel from '@/components/priceLabel/PriceLabel.component';
import { LoadingCell } from '@/pages/instances/datagrid/components/cell/LoadingCell.component';
import { useDashboard } from '../hooks/useDashboard';
import {
  DashboardTileBlock,
  DashboardTileText,
} from './DashboardTile.component';
import { useDashboardPolling } from '../hooks/useDashboardPolling';
import { TaskStatus } from '@/pages/instances/task/TaskStatus.component';
import { ActionsMenu } from '@/components/menu/ActionsMenu.component';
import { useInstanceParams } from '@/pages/instances/action/hooks/useInstanceActionModal';

const InstanceGeneralInfoBlock: FC = () => {
  const { t } = useTranslation(['dashboard', 'list', 'actions']);
  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { instanceId, region } = useInstanceParams();
  const hrefEditInstance = useHref(`../${instanceId}/edit`);
  const hrefBillingMonthlyActivate = useHref(
    `../${instanceId}/billing/monthly/activate?region=${region}`,
  );
  const hrefDeleteInstance = useHref(
    `../${instanceId}/delete?region=${region}`,
  );

  const { instance, pendingTasks, isPending: isInstanceLoading } = useDashboard(
    {
      region,
      instanceId,
    },
  );

  const polling = useDashboardPolling({
    instanceId,
    region,
    pendingTasks,
  });

  return (
    <DashboardCardLayout title={t('pci_instances_dashboard_info_title')}>
      <DashboardTileBlock
        label={t('pci_instances_dashboard_id_openstack_title')}
        isLoading={isInstanceLoading}
      >
        <div className="flex">
          <Clipboard className="flex-grow" value={instance?.id || ''}>
            <ClipboardControl className="w-full" />
            <ClipboardTrigger />
          </Clipboard>
        </div>
      </DashboardTileBlock>
      <DashboardTileBlock
        label={t('list:pci_instances_list_column_flavor')}
        isLoading={isInstanceLoading}
      >
        <div className="flex flex-col">
          <OsdsText
            className="my-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {instance?.flavor?.name}
          </OsdsText>
          {instance?.isEditEnabled && (
            <Links
              label={t('pci_instances_dashboard_upgrade_model')}
              type={LinkType.next}
              href={hrefEditInstance}
            />
          )}
        </div>
      </DashboardTileBlock>
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
      <DashboardTileBlock
        label={t('list:pci_instances_list_column_region')}
        isLoading={isInstanceLoading}
      >
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
      </DashboardTileBlock>
      <DashboardTileText
        label={t('pci_instances_dashboard_memory_title')}
        isLoading={isInstanceLoading}
      >
        {instance?.flavor?.ram}
      </DashboardTileText>
      <DashboardTileText
        label={t('pci_instances_dashboard_processor_title')}
        isLoading={isInstanceLoading}
      >
        {instance?.flavor?.cpu}
      </DashboardTileText>
      <DashboardTileBlock
        label={t('pci_instances_dashboard_price_title')}
        isLoading={isInstanceLoading}
      >
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
      </DashboardTileBlock>
      {instance && (
        <TileBlock>
          <div className="flex justify-between items-center">
            <OsdsText
              className="my-4"
              size={ODS_TEXT_SIZE._100}
              level={ODS_TEXT_LEVEL.subheading}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {t('pci_instances_dashboard_all_actions')}
            </OsdsText>
            <ActionsMenu items={instance.actions} />
          </div>
        </TileBlock>
      )}
      {instance?.isDeleteEnabled && (
        <LoadingCell isLoading={isInstanceLoading}>
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

export default InstanceGeneralInfoBlock;
