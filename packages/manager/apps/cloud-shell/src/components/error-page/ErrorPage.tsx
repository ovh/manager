import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import oopsImage from './oops.png';

type ErrorPageProps = {
  errorMessage?: string;
  xOvhQueryId?: string;
  reloadPage: () => void;
  navigateToHomepage: () => void;
};

export default function ErrorPage({
  errorMessage,
  xOvhQueryId,
  reloadPage,
  navigateToHomepage,
}: ErrorPageProps) {
  const { t } = useTranslation('error');

  return (
    <div
      style={{
        backgroundColor: '#F5FEFF',
      }}
      className="w-auto h-screen overflow-auto flex justify-center"
    >
      <div className="bg-white w-3/5 h-100 p-6 md:p-12">
        <div className="text-center mb-3">
          <img src={oopsImage} alt="" className="mw-100 inline mb-4" />
        </div>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.default}
          level={ODS_TEXT_LEVEL.heading}
          size={ODS_TEXT_SIZE._400}
        >
          {t('manager_error_page_title')}
        </OsdsText>
        <OsdsMessage type={ODS_MESSAGE_TYPE.error} className="mt-4 mb-4">
          <div>
            <OsdsText color={ODS_THEME_COLOR_INTENT.error}>
              {t('manager_error_page_default')}
            </OsdsText>
            {errorMessage && (
              <>
                <br />
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.error}
                  size={ODS_TEXT_SIZE._600}
                >
                  {errorMessage}
                </OsdsText>
              </>
            )}
            {xOvhQueryId && (
              <>
                <br />
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.error}
                  size={ODS_TEXT_SIZE._600}
                >
                  {t('manager_error_page_detail_code', { code: xOvhQueryId })}
                </OsdsText>
              </>
            )}
          </div>
        </OsdsMessage>

        <div className="flex justify-end">
          <OsdsButton
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_BUTTON_SIZE.sm}
            inline
            onClick={() => navigateToHomepage()}
          >
            {t('manager_error_page_action_home_label')}
          </OsdsButton>
          <OsdsButton
            variant={ODS_BUTTON_VARIANT.flat}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_BUTTON_SIZE.sm}
            inline
            onClick={() => reloadPage()}
          >
            {t('manager_error_page_action_reload_label')}
          </OsdsButton>
        </div>
      </div>
    </div>
  );
}
