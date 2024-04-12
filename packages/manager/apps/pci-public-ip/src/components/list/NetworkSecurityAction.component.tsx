import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type NetworkSecurityActionProps = {
  projectId: string;
  isFloatingIP?: boolean;
};

export const NetworkSecurityAction = ({
  projectId,
  isFloatingIP = true,
}: Readonly<NetworkSecurityActionProps>) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const nav = useNavigation();

  useEffect(() => {
    nav
      .getURL(
        'dedicated',
        isFloatingIP
          ? `#/ip?serviceName=${projectId}`
          : `#/ip?serviceName=_FAILOVER`,
        {},
      )
      .then(setUrl);
  }, []);

  return (
    <OsdsButton
      size={ODS_BUTTON_SIZE.sm}
      variant={ODS_BUTTON_VARIANT.ghost}
      color={ODS_THEME_COLOR_INTENT.primary}
      href={url}
    >
      <OsdsText
        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
        level={ODS_TEXT_LEVEL.button}
        color={ODS_THEME_COLOR_INTENT.primary}
        slot={'start'}
      >
        {isFloatingIP
          ? t('pci_additional_ips_floating_ip_grid_manage_network_security')
          : t('pci_additional_ips_manage_network_security')}
      </OsdsText>
    </OsdsButton>
  );
};
