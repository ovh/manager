import { useTranslation } from 'react-i18next';

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
import { OsdsIcon, OsdsLink, OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';

import { KUBECONFIG_3AZ_GATEWAY } from '@/constants';

const MultiZoneInfo = () => {
  const { t } = useTranslation(['network-add', 'service']);
  return (
    <OsdsMessage
      type={ODS_MESSAGE_TYPE.info}
      color={ODS_TEXT_COLOR_INTENT.info}
      className="flex my-2"
    >
      <div>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('kubernetes_network_form_notify_users')}{' '}
        </OsdsText>
        <OsdsLink
          target={OdsHTMLAnchorElementTarget._blank}
          color={ODS_THEME_COLOR_INTENT.primary}
          href={KUBECONFIG_3AZ_GATEWAY}
        >
          {t('service:kube_service_file_more_information')}
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

export default MultiZoneInfo;
