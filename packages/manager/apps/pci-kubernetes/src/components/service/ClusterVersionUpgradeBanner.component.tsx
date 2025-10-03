import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OsdsButton, OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';

import { VERSIONS_GUIDE_URL } from '@/constants';

export default function ClusterVersionUpgradeBanner() {
  const { t } = useTranslation('service');
  const hrefUpdate = useHref('./update');

  return (
    <OsdsMessage
      type={ODS_MESSAGE_TYPE.warning}
      color={ODS_THEME_COLOR_INTENT.warning}
      className="flex"
    >
      <div>
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
          className="block"
        >
          {t('kube_service_cluster_version_not_supported_message')}
        </OsdsText>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          inline
          data-testid="upgradeBanner-button"
          className="my-5"
          href={hrefUpdate}
        >
          {t('kube_service_minor_version_upgrade')}
        </OsdsButton>
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
          className="block"
        >
          <span
            dangerouslySetInnerHTML={{
              __html: t('kube_service_cluster_versions_guide', {
                versionGuideUrl: VERSIONS_GUIDE_URL,
              }),
            }}
          ></span>
        </OsdsText>
      </div>
    </OsdsMessage>
  );
}
