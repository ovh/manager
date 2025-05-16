import { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import { Clipboard, TileBlock } from '@ovh-ux/manager-react-components';
import DashboardCardLayout from './DashboardCardLayout.component';

const Network: FC = () => {
  const { t } = useTranslation(['dashboard', 'list']);

  const networks = [
    {
      type: 'ipv4',
      label: t('pci_instances_dashboard_network_ipv4'),
      value: '57.128.88.29',
      gateway: '57.128.88.1',
      dns: '-',
    },
    {
      type: 'ipv6',
      label: t('pci_instances_dashboard_network_ipv6'),
      value: '2001:41d0:304:500::e5',
      gateway: '2001:41d0:304:500::1',
      dns: '-',
    },
  ];

  return (
    <DashboardCardLayout title={t('pci_instances_dashboard_network_title')}>
      {networks.map(({ type, label, value, gateway, dns }) => (
        <Fragment key={type}>
          <TileBlock label={label}>
            <Clipboard value={value} />
            <div className="my-5">
              <OsdsText
                size={ODS_TEXT_SIZE._200}
                level={ODS_TEXT_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.primary}
                hue={ODS_THEME_COLOR_HUE._800}
              >
                {t('pci_instances_dashboard_network_gateway')}
              </OsdsText>
              <Clipboard value={gateway} />
            </div>
            <div className="flex flex-col">
              <OsdsText
                size={ODS_TEXT_SIZE._200}
                level={ODS_TEXT_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.primary}
                hue={ODS_THEME_COLOR_HUE._800}
              >
                {t('pci_instances_dashboard_network_dns')}
              </OsdsText>
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {dns}
              </OsdsText>
            </div>
          </TileBlock>
        </Fragment>
      ))}
      <TileBlock label={t('pci_instances_dashboard_network_private')}>
        <OsdsText
          className="my-4"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          -
        </OsdsText>
      </TileBlock>
      <TileBlock label={t('pci_instances_dashboard_network_connexion')}>
        <Clipboard value="ssh almalinux@57.128.88.29" />
      </TileBlock>
    </DashboardCardLayout>
  );
};

export default Network;
