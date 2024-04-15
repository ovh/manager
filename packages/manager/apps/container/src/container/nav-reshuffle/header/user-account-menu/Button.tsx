import React from 'react';

import { useTranslation } from 'react-i18next';

import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

type Props = {
  children?: JSX.Element | JSX.Element[];
  onClick(show: boolean): void;
  show?: boolean;
};

const UserAccountMenuButton = ({
  children = null,
  onClick,
  show = false,
}: Props): JSX.Element => {
  const { t } = useTranslation('user-account-menu');
  return (
    <OsdsButton
      id="header-user-menu-button"
      title={t('user_account_menu_manage_my_account')}
      aria-haspopup={show}
      aria-expanded={show}
      aria-label={t('user_account_menu_manage_my_account')}
      size={ODS_BUTTON_SIZE.sm}
      variant={ODS_BUTTON_VARIANT.ghost}
      color={ODS_THEME_COLOR_INTENT.primary}
      onClick={(e) => {
        e.preventDefault();
        onClick(!show);
      }}
    >
      {children}
    </OsdsButton>
  );
};

export default UserAccountMenuButton;
