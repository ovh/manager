import { useHref } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OsdsButton, OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';

export default function ClusterSecurityUpgradeBanner({ isDisabled }: { isDisabled?: boolean }) {
  const { t } = useTranslation('service');

  const hrefForceVersion = useHref('./update?forceVersion');

  return (
    <OsdsMessage type={ODS_MESSAGE_TYPE.info} color={ODS_THEME_COLOR_INTENT.info} className="flex">
      <div>
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
          className="block mb-5"
        >
          <Trans>{t('kube_service_cluster_update_available')}</Trans>
        </OsdsText>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          data-testid="upgradeBanner-button"
          href={hrefForceVersion}
          disabled={isDisabled}
          inline
        >
          {t('kube_service_common_update')}
        </OsdsButton>
      </div>
    </OsdsMessage>
  );
}
