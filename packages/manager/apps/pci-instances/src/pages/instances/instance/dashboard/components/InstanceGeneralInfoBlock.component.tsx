import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useHref, Link as RouterLink } from 'react-router-dom';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import { RegionChipByType } from '@ovh-ux/manager-pci-common';
import {
  BUTTON_VARIANT,
  Icon,
  Link,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import DashboardCardLayout from './DashboardCardLayout.component';
import PriceLabel from '@/components/priceLabel/PriceLabel.component';
import { useDashboard } from '../hooks/useDashboard';
import {
  DashboardTileBlock,
  DashboardTileText,
} from './DashboardTile.component';
import { useDashboardPolling } from '../hooks/useDashboardPolling';
import { TaskStatus } from '@/pages/instances/task/TaskStatus.component';
import { ActionsMenu } from '@/components/menu/ActionsMenu.component';
import { useInstanceParams } from '@/pages/instances/action/hooks/useInstanceActionModal';
import { Clipboard } from '@/components/clipboard/Clipboard.component';

const InstanceGeneralInfoBlock: FC = () => {
  const { t } = useTranslation([
    'dashboard',
    'list',
    'actions',
    NAMESPACES.FORM,
    NAMESPACES.STATUS,
    NAMESPACES.REGION,
    NAMESPACES.ACTIONS,
  ]);
  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { instanceId, region } = useInstanceParams();
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
          <Clipboard value={instance?.id ?? ''} />
        </div>
      </DashboardTileBlock>
      <DashboardTileBlock
        label={t('list:pci_instances_list_column_flavor')}
        isLoading={isInstanceLoading}
      >
        <div className="flex flex-col">
          <Text className="my-4">{instance?.flavor?.name}</Text>
          {instance?.isEditEnabled && (
            <Link
              as={RouterLink}
              to={`../${instanceId}/edit`}
              className="visited:text-[var(--ods-color-primary-500)]"
            >
              {t('pci_instances_dashboard_upgrade_model')}
              <Icon name="arrow-right" />
            </Link>
          )}
        </div>
      </DashboardTileBlock>
      {instance && (
        <DashboardTileBlock
          isLoading={isInstanceLoading}
          label={t('list:pci_instances_list_column_status')}
        >
          <TaskStatus
            isLoading={isInstanceLoading}
            isPolling={polling.length > 0}
            taskState={instance.task.status}
            status={instance.status}
          />
        </DashboardTileBlock>
      )}
      <DashboardTileBlock
        label={t(`${NAMESPACES.REGION}:localisation`)}
        isLoading={isInstanceLoading}
      >
        <div className="flex">
          <Text className="mr-4">
            {instance?.region.availabilityZone ??
              translateMicroRegion(instance?.region.name || '')}
          </Text>
          {instance && (
            <RegionChipByType type={instance.region.type} showTooltip={false} />
          )}
        </div>
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
        label={t(`${NAMESPACES.FORM}:price`)}
        isLoading={isInstanceLoading}
      >
        <div className="flex flex-col">
          <div>
            {instance?.pricings.map(({ value, type, label }) => (
              <div className="my-4" key={type}>
                <Text preset={TEXT_PRESET.span}>
                  {t(`pci_instances_dashboard_${label}_price_label`)}
                </Text>
                <PriceLabel value={value} type={type} />
              </div>
            ))}
          </div>
          {instance?.canActivateMonthlyBilling && (
            <Link
              as={RouterLink}
              to={`../${instanceId}/billing/monthly/activate?region=${region}`}
              className="visited:text-[var(--ods-color-primary-500)]"
            >
              {t(
                'actions:pci_instances_actions_billing_monthly_activate_instance_title',
              )}
              <Icon name="arrow-right" />
            </Link>
          )}
        </div>
      </DashboardTileBlock>
      {instance && (
        <DashboardTileBlock>
          <div className="flex justify-between items-center">
            <Text
              className="my-4 text-[var(--ods-color-primary-500)]"
              preset={TEXT_PRESET.label}
            >
              {t('pci_instances_dashboard_all_actions')}
            </Text>
            <ActionsMenu
              items={instance.actions}
              actionButton={{
                variant: BUTTON_VARIANT.ghost,
              }}
            />
          </div>
        </DashboardTileBlock>
      )}
      {instance?.isDeleteEnabled && (
        <DashboardTileBlock isLoading={isInstanceLoading} withoutDivider>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.error}
            href={hrefDeleteInstance}
          >
            {t(`${NAMESPACES.ACTIONS}:delete`)}
          </OsdsLink>
        </DashboardTileBlock>
      )}
    </DashboardCardLayout>
  );
};

export default InstanceGeneralInfoBlock;
