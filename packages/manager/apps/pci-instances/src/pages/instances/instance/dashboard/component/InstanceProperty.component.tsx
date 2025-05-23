import { FC } from 'react';
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
import { TVolume } from '@/types/instance/entity.type';

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

const InstanceProperty: FC<{
  storage: number;
  publicBandwidth: number;
  volumes: TVolume[];
  image: string;
  instanceId: string;
  sshKey: string;
  sshLogin: string;
}> = ({
  storage,
  publicBandwidth,
  volumes,
  image,
  instanceId,
  sshKey,
  sshLogin,
}) => {
  const { t } = useTranslation(['dashboard', 'list']);

  return (
    <DashboardCardLayout title={t('pci_instances_dashboard_property_title')}>
      <TileBlock label={t('pci_instances_dashboard_storage_title')}>
        <OsdsText
          className="my-4"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {storage}
        </OsdsText>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_public_bandwidth_title')}>
        <OsdsText
          className="my-4"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {publicBandwidth}
        </OsdsText>
      </TileBlock>
      <TileBlock label={t('list:pci_instances_list_column_volumes')}>
        <div className="flex flex-col">
          {volumes.length > 0 ? (
            volumes.map((volume) => (
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
      </TileBlock>
      <TileBlock label={t('list:pci_instances_list_column_image')}>
        <div className="flex flex-col">
          <OsdsText
            className="my-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {image}
          </OsdsText>
          <Links
            label={t('pci_instances_dashboard_edit_image')}
            type={LinkType.next}
          />
        </div>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_id_openstack_title')}>
        <Clipboard value={instanceId} />
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_ssh_key')}>
        <OsdsText
          className="my-4"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {sshKey}
        </OsdsText>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_network_connexion')}>
        <Clipboard value={sshLogin} />
      </TileBlock>
    </DashboardCardLayout>
  );
};

export default InstanceProperty;
