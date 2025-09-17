import { FC, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import DashboardCardLayout from './DashboardCardLayout.component';
import { DashboardTileBlock } from './DashboardTile.component';
import { Badge, Icon, Link, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useDashboard } from '../hooks/useDashboard';
import { useInstanceParams } from '@/pages/instances/action/hooks/useInstanceActionModal';

const BackupBlock: FC = () => {
  const { t, i18n } = useTranslation(['dashboard', 'list']);
  const { instanceId, region } = useInstanceParams();
  const { instance, isPending } = useDashboard({ region, instanceId });

  const locale = i18n.language.replace('_', '-');
  const backupLastUpdatedDate = useMemo(
    () =>
      instance?.backup
        ? `${new Date(instance.backup.lastUpdated).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}`
        : null,
    [instance?.backup, locale],
  );

  return (
    <DashboardCardLayout title={t('pci_instances_dashboard_backup_title')}>
      <DashboardTileBlock
        isLoading={isPending}
        label={t('pci_instances_dashboard_backup_number_of_backups')}
        withoutDivider
      >
        {instance?.backup ? (
          <Text className="py-4">{instance.backup.total}</Text>
        ) : (
          <Badge color="critical" className="my-4">
            {t('pci_instances_dashboard_backup_empty_message')}
          </Badge>
        )}
      </DashboardTileBlock>
      {backupLastUpdatedDate && (
        <DashboardTileBlock
          label={t('pci_instances_dashboard_backup_last_updated_backups')}
          withoutDivider
        >
          <Text className="py-4">{backupLastUpdatedDate}</Text>
        </DashboardTileBlock>
      )}
      {instance?.isEditEnabled && (
        <Link as={RouterLink} to={`../${instanceId}/backup?region=${region}`}>
          {t('list:pci_instances_list_action_create_backup')}
          <Icon name="arrow-right" />
        </Link>
      )}
    </DashboardCardLayout>
  );
};

export default BackupBlock;
