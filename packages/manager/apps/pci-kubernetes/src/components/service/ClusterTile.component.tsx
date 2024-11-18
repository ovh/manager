import { useTranslation, Trans } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import {
  OsdsPopover,
  OsdsPopoverContent,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import PopoverTrigger from '../input/PopoverTrigger.component';
import { QUOTA_ERROR_URL } from '@/helpers';

const ClusterTile = () => {
  const { t } = useTranslation(['service']);
  return (
    <OsdsPopover>
      <PopoverTrigger title={t('kube_service_cluster_etcd_quota')} />
      <OsdsPopoverContent>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
        >
          <Trans components={{ a: <a> </a> }}>
            {t('kube_service_cluster_etcd_quota_info', {
              link: QUOTA_ERROR_URL,
            })}
          </Trans>
        </OsdsText>
      </OsdsPopoverContent>
    </OsdsPopover>
  );
};

export default ClusterTile;
