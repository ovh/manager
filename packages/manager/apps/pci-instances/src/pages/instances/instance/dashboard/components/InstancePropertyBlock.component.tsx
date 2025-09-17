import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { Link as RouterLink } from 'react-router-dom';
import { Icon, Link, Text } from '@ovhcloud/ods-react';
import DashboardCardLayout from './DashboardCardLayout.component';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardTileBlock } from './tile/DashboardTile.component';
import { useInstanceParams } from '@/pages/instances/action/hooks/useInstanceActionModal';
import { Clipboard } from '@/components/clipboard/Clipboard.component';

const InstancePropertyBlock: FC = () => {
  const { t } = useTranslation(['dashboard', 'list']);
  const projectUrl = useProjectUrl('public-cloud');
  const { region, instanceId } = useInstanceParams();

  const { instance, isPending: isInstanceLoading } = useDashboard({
    region,
    instanceId,
  });

  return (
    <DashboardCardLayout title={t('pci_instances_dashboard_property_title')}>
      <DashboardTileBlock
        label={t('pci_instances_dashboard_storage_title')}
        isLoading={isInstanceLoading}
      >
        <Text>{instance?.flavor?.storage}</Text>
      </DashboardTileBlock>
      <DashboardTileBlock
        label={t('pci_instances_dashboard_public_bandwidth_title')}
        isLoading={isInstanceLoading}
      >
        <Text>{instance?.flavor?.publicBandwidth}</Text>
      </DashboardTileBlock>
      <DashboardTileBlock
        label={t('list:pci_instances_list_column_volumes')}
        isLoading={isInstanceLoading}
      >
        <div className="flex flex-col gap-y-4">
          {instance?.volumes.length ? (
            instance.volumes.map(({ id, name }) => (
              <Link
                key={id}
                href={`${projectUrl}/storages/blocks/${id}/edit`}
                className="block whitespace-nowrap overflow-hidden text-ellipsis max-w-[13rem]"
              >
                {name}
              </Link>
            ))
          ) : (
            <Text className="my-4">-</Text>
          )}
          {instance?.isEditEnabled && (
            <Link as={RouterLink} to="./attach">
              {t('pci_instances_dashboard_attach_volumes')}
              <Icon name="arrow-right" />
            </Link>
          )}
        </div>
      </DashboardTileBlock>
      <DashboardTileBlock
        label={t('list:pci_instances_list_column_image')}
        isLoading={isInstanceLoading}
      >
        <Text className="my-4">{instance?.image}</Text>
        {instance?.isEditEnabled && (
          <Link as={RouterLink} to={`../${instanceId}/edit`}>
            {t('pci_instances_dashboard_edit_image')}
            <Icon name="arrow-right" />
          </Link>
        )}
      </DashboardTileBlock>
      {instance?.sshKey && (
        <DashboardTileBlock
          label={t('pci_instances_dashboard_ssh_key')}
          isLoading={isInstanceLoading}
        >
          <Text>{instance.sshKey}</Text>
        </DashboardTileBlock>
      )}
      {instance?.login && (
        <DashboardTileBlock
          label={t('pci_instances_dashboard_network_connexion')}
        >
          <div className="flex">
            <Clipboard value={instance.login} />
          </div>
        </DashboardTileBlock>
      )}
    </DashboardCardLayout>
  );
};

export default InstancePropertyBlock;
