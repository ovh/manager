import { useEffect, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';

export const AdditionalIPServiceAction = () => {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const nav = useNavigation();

  useEffect(() => {
    nav.getURL('dedicated', `#/ip?serviceName=_FAILOVER`, {}).then(setUrl);
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
        {t('pci_additional_ips_manage_ip_failover_service')}
      </OsdsText>
    </OsdsButton>
  );
};
