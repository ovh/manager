import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  Clipboard,
  Links,
  LinkType,
  TileBlock,
} from '@ovh-ux/manager-react-components';
import DashboardCardLayout from './DashboardCardLayout.component';
import { InstanceDetailContext } from '../Instance.page';
import { LoadingCell } from '@/components/datagrid/cell/LoadingCell.component';

const LabelName: FC<{ name: string }> = ({ name }) => (
  <OsdsText
    className="my-4"
    size={ODS_TEXT_SIZE._400}
    level={ODS_TEXT_LEVEL.body}
    color={ODS_THEME_COLOR_INTENT.text}
  >
    {name}
  </OsdsText>
);

const InstanceProperty: FC = () => {
  const { t } = useTranslation(['dashboard', 'list']);
  const { data: instance, isLoading } = useContext(InstanceDetailContext);

  return (
    <DashboardCardLayout title={t('pci_instances_dashboard_property_title')}>
      <TileBlock label={t('pci_instances_dashboard_storage_title')}>
        <LoadingCell isLoading={isLoading}>
          <OsdsText
            className="my-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {instance.storage}
          </OsdsText>
        </LoadingCell>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_public_bandwidth_title')}>
        <LoadingCell isLoading={isLoading}>
          <OsdsText
            className="my-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {instance.publicBandwidth}
          </OsdsText>
        </LoadingCell>
      </TileBlock>
      <TileBlock label={t('list:pci_instances_list_column_volumes')}>
        <LoadingCell isLoading={isLoading}>
          <div className="flex flex-col">
            {instance.volumes.length > 0 ? (
              instance.volumes.map((volume) => (
                <LabelName key={volume.id} name={volume.name} />
              ))
            ) : (
              <LabelName name="-" />
            )}

            <Links
              label={t('pci_instances_dashboard_attach_volumes')}
              type={LinkType.next}
            />
          </div>
        </LoadingCell>
      </TileBlock>
      <TileBlock label={t('list:pci_instances_list_column_image')}>
        <LoadingCell isLoading={isLoading}>
          <div className="flex flex-col">
            <OsdsText
              className="my-4"
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {instance.imageName}
            </OsdsText>
            <Links
              label={t('pci_instances_dashboard_edit_image')}
              type={LinkType.next}
            />
          </div>
        </LoadingCell>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_id_openstack_title')}>
        <Clipboard value={instance.id} />
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_ssh_key')}>
        <LoadingCell isLoading={isLoading}>
          <OsdsText
            className="my-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {instance.sshKey}
          </OsdsText>
        </LoadingCell>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_network_connexion')}>
        <Clipboard value={instance.sshLogin} />
      </TileBlock>
    </DashboardCardLayout>
  );
};

export default InstanceProperty;
