import { useTranslation, Trans } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ErrorBoundary } from 'react-error-boundary';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { QUOTA_ERROR_URL } from '@/helpers';

const ClusterTile = () => {
  const { t } = useTranslation(['service']);
  return (
    <OsdsPopover>
      <span slot="popover-trigger">
        <OsdsText
          className="mb-4"
          size={ODS_TEXT_SIZE._200}
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
          onClick={(event) => event.stopPropagation()}
        >
          {t('kube_service_cluster_etcd_quota')}
        </OsdsText>
        <OsdsIcon
          name={ODS_ICON_NAME.HELP}
          size={ODS_ICON_SIZE.xs}
          className="ml-4 cursor-help"
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </span>
      <OsdsPopoverContent>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
        >
          <Trans components={{ a: <a></a> }}>
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
