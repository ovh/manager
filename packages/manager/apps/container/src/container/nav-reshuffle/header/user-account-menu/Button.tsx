import React from 'react';

import { useTranslation } from 'react-i18next';

import style from './style.module.scss';
import { OsdsButton } from '@ovhcloud/ods-stencil/components/react/';
import { OdsButtonSize, OdsButtonVariant } from '@ovhcloud/ods-core';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';

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
      size={OdsButtonSize.sm}
      variant={OdsButtonVariant.ghost}
      color={OdsThemeColorIntent.primary}
      flex
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
