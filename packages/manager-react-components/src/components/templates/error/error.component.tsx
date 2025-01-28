import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText, OdsButton, OdsMessage } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { PageType, ShellContext } from '@ovh-ux/manager-react-shell-client';

import { ErrorMessage, TRACKING_LABELS, ErrorBannerProps } from './error.types';
import './translations/translations';
import ErrorImg from '../../../../public/assets/error-banner-oops.png';

function getTrackingTypology(error: ErrorMessage) {
  if (error?.status && Math.floor(error.status / 100) === 4) {
    return [401, 403].includes(error.status)
      ? TRACKING_LABELS.UNAUTHORIZED
      : TRACKING_LABELS.SERVICE_NOT_FOUND;
  }
  return TRACKING_LABELS.PAGE_LOAD;
}

export const ErrorBanner = ({
  error,
  onRedirectHome,
  onReloadPage,
  labelTracking,
  ...rest
}: ErrorBannerProps) => {
  const { t } = useTranslation('error');
  const { shell } = React.useContext(ShellContext);
  const env = shell?.environment?.getEnvironment();

  React.useEffect(() => {
    env?.then((response) => {
      const { applicationName } = response;
      const name = `errors::${getTrackingTypology(error)}::${applicationName}`;
      shell?.tracking?.trackPage({
        name,
        level2: '81',
        type: 'navigation',
        page_category: PageType.bannerError,
      });
    });
  }, []);

  return (
    <div
      className="mx-auto  w-full h-full max-w-[600px] overflow-hidden mx-autogrid p-5"
      {...rest}
    >
      <img src={ErrorImg} alt="OOPS" className="w-full" />
      <div className="py-2">
        <OdsText preset={ODS_TEXT_PRESET.heading1}>
          {t('manager_error_page_title')}
        </OdsText>
      </div>
      <div>
        <OdsMessage
          color={ODS_MESSAGE_COLOR.warning}
          data-tracking={labelTracking}
          className="w-full"
        >
          <div>
            <div>{t('manager_error_page_default')}</div>
            <div>
              {error?.data?.message && <strong>{error.data.message}</strong>}
            </div>
            <div>
              {error?.headers?.['x-ovh-queryid'] && (
                <p>
                  {t('manager_error_page_detail_code')}
                  {error.headers['x-ovh-queryid']}
                </p>
              )}
            </div>
          </div>
        </OdsMessage>
      </div>
      <div className="overflow-hidden mt-5 py-2">
        <div>
          <OdsButton
            data-testid="error-template-action-home"
            className="error-template-actions  w-full"
            variant={ODS_BUTTON_VARIANT.ghost}
            onClick={onRedirectHome}
            label={t('manager_error_page_action_home_label')}
          />
        </div>
        <div>
          <OdsButton
            data-testid="error-template-action-reload"
            className="error-template-actions w-full "
            onClick={onReloadPage}
            label={t('manager_error_page_action_reload_label')}
          />
        </div>
      </div>
    </div>
  );
};
