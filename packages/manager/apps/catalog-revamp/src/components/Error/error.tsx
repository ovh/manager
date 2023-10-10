import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsMessage } from '@ovhcloud/ods-components/message/react/';
import { OsdsText } from '@ovhcloud/ods-components/text/react/';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components/message/';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text/';
import ErrorButtons from './ErrorButtons';
import ErrorMessage from './ErrorMessage';
import OOPS from '../../assets/error-banner-oops.png';
import './error.scss';

export const TRACKING_LABELS = {
  SERVICE_NOT_FOUND: 'service_not_found',
  UNAUTHORIZED: 'unauthorized',
  PAGE_LOAD: 'error_during_page_loading',
};

function getTrackingTypology() {
  const { error } = this.state;

  if (error?.detail?.status && Math.floor(error.detail.status / 100) === 4) {
    return [401, 403].includes(error.detail.status)
      ? TRACKING_LABELS.UNAUTHORIZED
      : TRACKING_LABELS.SERVICE_NOT_FOUND;
  }
  return TRACKING_LABELS.PAGE_LOAD;
}

interface ErrorObject {
  [key: string]: any;
}

const ErrorBanner: React.FC<ErrorObject> = ({ error }) => {
  const { t } = useTranslation('catalog-revamp/error');
  return (
    <div className="manager-error-page p-5">
      <div className="manager-error-page-image">
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
          <ErrorMessage error={error} />
        </OsdsMessage>
      </div>

      <ErrorButtons />
    </div>
  );
};

export default ErrorBanner;
