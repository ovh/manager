import { useNavigate, useParams } from 'react-router-dom';
import { OsdsIcon, OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { Notifications, useMe } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { LogsView } from '@ovh-ux/manager-pci-common';
import { LOAD_BALANCER_LOGS_SERVICE_GUIDE_LINK } from '@/constants';
import { LoadBalancerLogsProvider } from './LoadBalancerLogsProvider';

export default function LogsPage() {
  const { t } = useTranslation('logs');
  const { projectId, loadBalancerId, region } = useParams();
  const navigate = useNavigate();
  const ovhSubsidiary = useMe()?.me?.ovhSubsidiary;
  const infoLink =
    LOAD_BALANCER_LOGS_SERVICE_GUIDE_LINK[ovhSubsidiary] ||
    LOAD_BALANCER_LOGS_SERVICE_GUIDE_LINK.DEFAULT;

  return (
    <LoadBalancerLogsProvider
      loadBalancerId={loadBalancerId}
      projectId={projectId}
      region={region}
    >
      <Notifications />
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('octavia_load_balancer_logs_main_description')}{' '}
      </OsdsText>
      <OsdsLink
        color={ODS_THEME_COLOR_INTENT.primary}
        href={infoLink}
        target={OdsHTMLAnchorElementTarget._blank}
      >
        {t('see_more_label')}
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
      <LogsView onGotoStreams={() => navigate('./streams')} />
    </LoadBalancerLogsProvider>
  );
}
