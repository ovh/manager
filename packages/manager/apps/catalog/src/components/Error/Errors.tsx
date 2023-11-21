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

interface ErrorObject {
  [key: string]: any;
}

const ErrorBanner: React.FC<ErrorObject> = ({ error }) => {
  const { t } = useTranslation('catalog/error');
  return (
    <div className="w-full max-w-screen-sm h-full overflow-hidden mx-autogrid p-5">
      <div>
        <img className="w-full" src={OOPS} alt="OOPS" />
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
