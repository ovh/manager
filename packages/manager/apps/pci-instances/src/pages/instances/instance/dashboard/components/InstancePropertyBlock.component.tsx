import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Links,
  LinkType,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useHref } from 'react-router-dom';
import { Text } from '@ovhcloud/ods-react';
import DashboardCardLayout from './DashboardCardLayout.component';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardTileBlock } from './DashboardTile.component';
import { useInstanceParams } from '@/pages/instances/action/hooks/useInstanceActionModal';
import { Clipboard } from '@/components/clipboard/Clipboard.component';

const InstancePropertyBlock: FC = () => {
  const { t } = useTranslation(['dashboard', 'list']);
  const projectUrl = useProjectUrl('public-cloud');
  const { region, instanceId } = useInstanceParams();
  const hrefEditInstance = useHref(`../${instanceId}/edit`);
  const hrefAttachVolume = useHref('./attach');

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
              <Links
                key={id}
                label={name}
                href={`${projectUrl}/storages/blocks/${id}/edit`}
              />
            ))
          ) : (
            <Text className="my-4">-</Text>
          )}
          <Links
            label={t('pci_instances_dashboard_attach_volumes')}
            type={LinkType.next}
            href={hrefAttachVolume}
          />
        </div>
      </DashboardTileBlock>
      <DashboardTileBlock
        label={t('list:pci_instances_list_column_image')}
        isLoading={isInstanceLoading}
      >
        <Text className="my-4">{instance?.image}</Text>
        {instance?.isEditEnabled && (
          <Links
            label={t('pci_instances_dashboard_edit_image')}
            type={LinkType.next}
            href={hrefEditInstance}
          />
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
          withoutDivider
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
