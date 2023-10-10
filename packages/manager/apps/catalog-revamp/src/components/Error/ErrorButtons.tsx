import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsButton } from '@ovhcloud/ods-components/button/react/';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components/button/';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export const ErrorButtons = () => {
  const { t } = useTranslation('catalog-revamp/error');
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="manager-error-page-footer py-2">
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
  );
};

export default ErrorButtons;
