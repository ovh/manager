import { useContext, useEffect, useState } from 'react';
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
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

type PrivateNetworkButtonProps = {
  projectId: string;
};
export const PrivateNetworkButton = ({
  projectId,
}: Readonly<PrivateNetworkButtonProps>) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const nav = useContext(ShellContext).shell.navigation;

  useEffect(() => {
    nav
      .getURL(
        'public-cloud',
        `#/pci/projects/${projectId}/private-networks`,
        {},
      )
      .then(setUrl);
  }, [projectId]);

  return (
    <OsdsButton
      size={ODS_BUTTON_SIZE.sm}
      variant={ODS_BUTTON_VARIANT.ghost}
      data-testid="privateNetworkButton-link"
      color={ODS_THEME_COLOR_INTENT.primary}
      href={url}
    >
      <OsdsText
        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
        level={ODS_TEXT_LEVEL.button}
        color={ODS_THEME_COLOR_INTENT.primary}
        slot={'start'}
      >
        {t('pci_projects_project_public_gateway_go_to_private_networks')}
      </OsdsText>
    </OsdsButton>
  );
};
