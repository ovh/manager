import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OsdsMessage } from '@ovhcloud/ods-components/message/react';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components/message';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components/button';
import { useShell } from '@ovh-ux/manager-react-core-application';

import OOPS from '../../assets/error-banner-oops.png';

const TRACKING_LABELS = {
  SERVICE_NOT_FOUND: 'service_not_found',
  UNAUTHORIZED: 'unauthorized',
  PAGE_LOAD: 'error_during_page_loading',
};

interface ErrorMessage {
  message: string;
  status: number;
  detail: any;
}

interface ErrorObject {
  [key: string]: any;
}

function getTrackingTypology(error: ErrorMessage) {
  if (error?.detail?.status && Math.floor(error.detail.status / 100) === 4) {
    return [401, 403].includes(error.detail.status)
      ? TRACKING_LABELS.UNAUTHORIZED
      : TRACKING_LABELS.SERVICE_NOT_FOUND;
  }
  return TRACKING_LABELS.PAGE_LOAD;
}

const ErrorBanner: React.FC<ErrorObject> = ({ error }) => {
  const { t } = useTranslation('pci-rancher/error');
  const navigate = useNavigate();
  const location = useLocation();
  const shell = useShell();
  const { tracking, environment } = shell;
  const env = environment.getEnvironment();

  useEffect(() => {
    tracking.init(false);
    env.then((response) => {
      const { applicationName } = response;
      const name = `errors::${getTrackingTypology(error)}::${applicationName}`;
      console.info('lance le track page navigation error');
      tracking.trackPage({
        name,
        level2: '81',
        type: 'navigation',
        page_category: location.pathname,
      });
    });
  }, []);

  return (
    <div className="mx-auto w-full max-w-[600px] grid h-full overflow-hidden p-5">
      <div className="w-full">
        <img src={OOPS} alt="OOPS" />
      </div>

      <div className="py-2">
        <OsdsText size={ODS_TEXT_SIZE._600} level={ODS_TEXT_LEVEL.heading}>
          {t('manager_error_page_title')}
        </OsdsText>
      </div>

      <div>
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.error}
          type={ODS_MESSAGE_TYPE.error}
        >
          <div>
            {t('manager_error_page_default')} <br />
            {error?.data?.message && <strong>{error.data.message}</strong>}
            {error?.headers['x-ovh-queryid'] && (
              <p>
                {t('manager_error_page_detail_code')}
                {error.headers['x-ovh-queryid']}
              </p>
            )}
          </div>
        </OsdsMessage>
      </div>

      <div className="text-right overflow-hidden py-2">
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={() => navigate('/', { replace: true })}
        >
          {t('manager_error_page_action_home_label')}
        </OsdsButton>
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.flat}
          onClick={() => navigate(location.pathname, { replace: true })}
        >
          {t('manager_error_page_action_reload_label')}
        </OsdsButton>
      </div>
    </div>
  );
};

export default ErrorBanner;
