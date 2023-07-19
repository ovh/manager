import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OsdsMessage,
  OsdsText,
  OsdsButton,
} from '@ovhcloud/ods-stencil/components/react/';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';
import {
  OdsMessageType,
  OdsTextLevel,
  OdsButtonVariant,
  OdsTextSize,
} from '@ovhcloud/ods-core';
import { useShell } from '@ovh-ux/manager-react-core-application';

import OOPS from '../../assets/error-banner-oops.png';
import './error.scss';

export const TRACKING_LABELS = {
  SERVICE_NOT_FOUND: 'service_not_found',
  UNAUTHORIZED: 'unauthorized',
  PAGE_LOAD: 'error_during_page_loading',
};

interface errorMessage {
  message: string;
  status: number;
  detail: any;
}

interface ErrorObject {
  [key: string]: any;
}

function getTrackingTypology(error: errorMessage) {
  if (error?.detail?.status && Math.floor(error.detail.status / 100) === 4) {
    return [401, 403].includes(error.detail.status)
      ? TRACKING_LABELS.UNAUTHORIZED
      : TRACKING_LABELS.SERVICE_NOT_FOUND;
  }
  return TRACKING_LABELS.PAGE_LOAD;
}

const ErrorBanner: React.FC<ErrorObject> = ({ error }) => {
  const { t } = useTranslation('{{appName}}/error');
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
    <div className="manager-error-page p-5">
      <div className="manager-error-page-image">
        <img src={OOPS} alt="OOPS" />
      </div>

      <div className="py-2">
        <OsdsText size={OdsTextSize._600} level={OdsTextLevel.heading}>
          {t('manager_error_page_title')}
        </OsdsText>
      </div>

      <div>
        <OsdsMessage
          color={OdsThemeColorIntent.error}
          type={OdsMessageType.error}
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

      <div className="manager-error-page-footer py-2">
        <OsdsButton
          color={OdsThemeColorIntent.primary}
          variant={OdsButtonVariant.ghost}
          onClick={() => navigate('/', { replace: true })}
        >
          {t('manager_error_page_action_home_label')}
        </OsdsButton>
        <OsdsButton
          color={OdsThemeColorIntent.primary}
          variant={OdsButtonVariant.flat}
          onClick={() => navigate(location.pathname, { replace: true })}
        >
          {t('manager_error_page_action_reload_label')}
        </OsdsButton>
      </div>
    </div>
  );
};

export default ErrorBanner;
