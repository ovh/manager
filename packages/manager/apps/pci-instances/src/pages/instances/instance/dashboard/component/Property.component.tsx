import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Links, LinkType, TileBlock } from '@ovh-ux/manager-react-components';
import DashboardCardLayout from './DashboardCardLayout.component';

const Property: FC = () => {
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
          200 Gio
        </OsdsText>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_public_bandwidth_title')}>
        <OsdsText
          className="my-4"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          500 Mbps
        </OsdsText>
      </TileBlock>
      <TileBlock label={t('list:pci_instances_list_column_volumes')}>
        <div className="flex flex-col">
          <OsdsText
            className="my-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            -
          </OsdsText>
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
            AlmaLinux 9
          </OsdsText>
          <Links
            label={t('pci_instances_dashboard_edit_image')}
            type={LinkType.next}
          />
        </div>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_id_openstack_title')}>
        <OsdsText
          className="my-4"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          6398225c-67f6-4ddb-a05b-deeac795fb42
        </OsdsText>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_ssh_key')}>
        <OsdsText
          className="my-4"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          ssht
        </OsdsText>
      </TileBlock>
    </DashboardCardLayout>
  );
};

export default Property;
