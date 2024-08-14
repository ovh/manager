import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OsdsButton,
  OsdsText,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ApiError } from '@ovh-ux/manager-core-api';
import OOPS from '@/assets/error-banner-oops.png';
import { urls } from '@/routes/routes.constants';

export const TRACKING_LABELS = {
  SERVICE_NOT_FOUND: 'service_not_found',
  UNAUTHORIZED: 'unauthorized',
  PAGE_LOAD: 'error_during_page_loading',
};

export type ErrorBannerProps = {
  error: ApiError;
};

function getTrackingTypology(error: ApiError) {
  if (error?.status && Math.floor(error.status / 100) === 4) {
    return [401, 403].includes(error.status)
      ? TRACKING_LABELS.UNAUTHORIZED
      : TRACKING_LABELS.SERVICE_NOT_FOUND;
  }
  return TRACKING_LABELS.PAGE_LOAD;
}

export const ErrorPage: React.FC<ErrorBannerProps> = ({ error }) => {
  const { t } = useTranslation('vrack-services/error');
  const navigate = useNavigate();
  const location = useLocation();
  const {
    environment,
    shell: { tracking },
  } = React.useContext(ShellContext);

  React.useEffect(() => {
    tracking.init(false);
    const name = `errors::${getTrackingTypology(error)}::${
      environment.applicationName
    }`;

    tracking.trackPage({
      name,
      level2: '81',
      type: 'navigation',
      page_category: location.pathname,
    });
  }, [environment.applicationName]);

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
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('manager_error_page_default')} <br />
            {error?.response?.data?.message && (
              <strong>{error.response.data.message}</strong>
            )}
            {error?.response.headers['x-ovh-queryid'] && (
              <p>
                {t('manager_error_page_detail_code')}
                {error.response.headers['x-ovh-queryid']}
              </p>
            )}
          </OsdsText>
        </OsdsMessage>
      </div>

      <div className="text-right overflow-hidden py-2">
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={() => navigate(urls.listing)}
        >
          {t('manager_error_page_action_home_label')}
        </OsdsButton>
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.flat}
          onClick={() => navigate(location.pathname)}
        >
          {t('manager_error_page_action_reload_label')}
        </OsdsButton>
      </div>
    </div>
  );
};
