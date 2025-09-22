import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import {
  OsdsIcon,
  OsdsLink,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { QUOTA_ERROR_URL } from '@/helpers';

import PopoverTrigger from '../input/PopoverTrigger.component';

const ClusterTile = () => {
  const { t } = useTranslation(['service', 'logs']);
  return (
    <OsdsPopover>
      <PopoverTrigger title={t('kube_service_cluster_etcd_quota')} />
      <OsdsPopoverContent>
        <OsdsText color={ODS_THEME_COLOR_INTENT.text} level={ODS_TEXT_LEVEL.body}>
          <>
            {t('kube_service_cluster_etcd_quota_info')}
            <OsdsLink
              color={ODS_THEME_COLOR_INTENT.primary}
              href={QUOTA_ERROR_URL}
              target={OdsHTMLAnchorElementTarget._blank}
            >
              {t('logs:see_more_label')}
              <span slot="end">
                <OsdsIcon
                  aria-hidden="true"
                  className="ml-4"
                  name={ODS_ICON_NAME.EXTERNAL_LINK}
                  hoverable
                  size={ODS_ICON_SIZE.xxs}
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
              </span>
            </OsdsLink>
          </>
        </OsdsText>
      </OsdsPopoverContent>
    </OsdsPopover>
  );
};

export default ClusterTile;
