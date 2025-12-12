import { useTranslation } from 'react-i18next';

import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import style from './style.module.scss';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import clsx from 'clsx';

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
  const { isMobile } = useProductNavReshuffle();


  const userIconClassName = clsx(
    'bg-[var(--ods-color-primary-100)]',
    isMobile ? 'size-8' : 'size-7',
  );
  return (
    <div
      role="button"
      id="header-user-menu-button"
      title={t('user_account_menu_manage_my_account')}
      aria-haspopup={show}
      aria-expanded={show}
      aria-label={t('user_account_menu_manage_my_account')}
      onClick={(e) => {
        e.preventDefault();
        onClick(!show);
      }}
    >
      <div className={style.userMenuLink}>
        <OsdsIcon
          name={ODS_ICON_NAME.USER}
          size={ODS_ICON_SIZE.sm}
          aria-hidden="true"
          className={userIconClassName}
        ></OsdsIcon>
        {children}
        {!isMobile && <OsdsIcon
          name={ODS_ICON_NAME.CHEVRON_DOWN}
          size={ODS_ICON_SIZE.sm}
          aria-hidden="true"
          className="size-7 bg-[var(--ods-color-primary-100)]"
        ></OsdsIcon>}
      </div>
    </div>
  );
};

export default UserAccountMenuButton;
