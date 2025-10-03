import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';

export default function ClusterBeta3AZ() {
  const { t } = useTranslation('service');

  return (
    <OsdsMessage type={ODS_MESSAGE_TYPE.info} color={ODS_THEME_COLOR_INTENT.info} className="flex">
      <div>
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
          className="block"
        >
          {t('kube_service_cluster_status_MULTI_ZONES')}
        </OsdsText>
      </div>
    </OsdsMessage>
  );
}
