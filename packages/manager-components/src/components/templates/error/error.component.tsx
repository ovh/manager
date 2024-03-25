import React from 'react';
import {
  OsdsText,
  OsdsButton,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';

import useDynamicTranslation from '../../../translation/useDynamicTranslation';
import OOPS from './assets/error-banner-oops.png';

import { ErrorBannerProps } from './error.types';

export const ErrorBanner = ({
  error,
  onRedirectHome,
  onReloadPage,
  labelTracking,
}: ErrorBannerProps) => {
  const { t } = useDynamicTranslation('error');

  return (
    <div className="mx-auto  w-full h-full max-w-[600px] overflow-hidden mx-autogrid p-5">
      <img src={OOPS} alt="OOPS" className="w-full" />
      <div className="py-2">
        <OsdsText size={ODS_TEXT_SIZE._600} level={ODS_TEXT_LEVEL.heading}>
          {t('manager_error_page_title')}
        </OsdsText>
      </div>
      <div>
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.error}
          type={ODS_MESSAGE_TYPE.error}
          data-tracking={labelTracking}
        >
          <OsdsText color={ODS_THEME_COLOR_INTENT.error}>
            {t('manager_error_page_default')} <br />
            {error?.data?.message && <strong>{error.data.message}</strong>}
            {error?.headers?.['x-ovh-queryid'] && (
              <p>
                {t('manager_error_page_detail_code')}
                {error.headers['x-ovh-queryid']}
              </p>
            )}
          </OsdsText>
        </OsdsMessage>
      </div>
      <div className="text-right overflow-hidden py-2">
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={onRedirectHome}
        >
          <span slot="start"></span>
          {t('manager_error_page_action_home_label')}
        </OsdsButton>
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.flat}
          onClick={onReloadPage}
        >
          <span slot="start"></span>
          {t('manager_error_page_action_reload_label')}
        </OsdsButton>
      </div>
    </div>
  );
};
