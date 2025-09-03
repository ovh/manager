import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  Links,
  LinkType,
  TileBlock,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useHref } from 'react-router-dom';
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
        <OsdsText
          className="my-4"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {instance?.flavor?.storage}
        </OsdsText>
      </DashboardTileBlock>
      <DashboardTileBlock
        label={t('pci_instances_dashboard_public_bandwidth_title')}
        isLoading={isInstanceLoading}
      >
        <OsdsText
          className="my-4"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {instance?.flavor?.publicBandwidth}
        </OsdsText>
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
            <OsdsText
              className="my-4"
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              -
            </OsdsText>
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
        <div className="flex flex-col">
          <OsdsText
            className="my-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {instance?.image}
          </OsdsText>
          {instance?.isEditEnabled && (
            <Links
              label={t('pci_instances_dashboard_edit_image')}
              type={LinkType.next}
              href={hrefEditInstance}
            />
          )}
        </div>
      </DashboardTileBlock>
      {instance?.sshKey && (
        <DashboardTileBlock
          label={t('pci_instances_dashboard_ssh_key')}
          isLoading={isInstanceLoading}
        >
          <OsdsText
            className="my-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {instance.sshKey}
          </OsdsText>
        </DashboardTileBlock>
      )}
      {instance?.login && (
        <TileBlock label={t('pci_instances_dashboard_network_connexion')}>
          <div className="flex">
            <Clipboard value={instance.login} />
          </div>
        </TileBlock>
      )}
    </DashboardCardLayout>
  );
};

export default InstancePropertyBlock;
