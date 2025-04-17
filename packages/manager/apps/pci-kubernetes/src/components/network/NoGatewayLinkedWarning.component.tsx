import {
  OsdsMessage,
  OsdsText,
  OsdsIcon,
  OsdsLink,
} from '@ovhcloud/ods-components/react';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';

import { useTranslation } from 'react-i18next';
import { useProjectUrl } from '@ovh-ux/manager-react-components';

const NoGatewayLinkedMessage = () => {
  const projectURL = useProjectUrl('public-cloud');
  const privateNetworkURL = `${projectURL}/private-networks`;
  const { t } = useTranslation(['network-add', 'service']);
  return (
    <OsdsMessage
      type={ODS_MESSAGE_TYPE.warning}
      color={ODS_TEXT_COLOR_INTENT.warning}
      className="flex my-2"
    >
      <div>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('kubernetes_network_form_no_associated_gateway')}{' '}
        </OsdsText>
        <OsdsLink
          target={OdsHTMLAnchorElementTarget._blank}
          color={ODS_THEME_COLOR_INTENT.primary}
          href={privateNetworkURL}
        >
          {t('kubernetes_network_form_add')}
          <OsdsIcon
            className="ml-5"
            aria-hidden="true"
            name={ODS_ICON_NAME.ARROW_RIGHT}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </OsdsLink>
      </div>
    </OsdsMessage>
  );
};

export default NoGatewayLinkedMessage;
