import { useRef, useEffect, useCallback } from 'react';

import useClickAway from 'react-use/lib/useClickAway';

import { OsdsIcon, OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE, ODS_SKELETON_SIZE, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import UserAccountMenuButton from './Button';
import UserAccountMenuContent from './Content';
import useOnboarding from '@/core/onboarding';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import { useShell } from '@/context';
import { useHeader } from '@/context/header';

import style from './style.module.scss';
import { tracking } from './constants';
import { UserName } from '@/components/user-name/UserName.component';
import useContainer from '@/core/container';

type Props = {
  onToggle(show: boolean): void;
};

export const UserAccountMenu = ({ onToggle }: Props): JSX.Element => {
  const ref = useRef();
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');
  const { setIsNotificationsSidebarVisible } = useHeader();

  const { isReady } = useContainer();

  const {
    onboardingOpenedState,
    isAccountSidebarOpened,
    openAccountSidebar,
    closeAccountSidebar,
  } = useProductNavReshuffle();
  const onboardingHelper = useOnboarding();

  const handleRootClose = () => {
    if (!onboardingHelper.hasStarted(onboardingOpenedState)) {
      closeAccountSidebar();
    }
  };

  const onUserAccountMenuButtonClick = useCallback((nextShow: boolean) => {
    if (nextShow) {
      openAccountSidebar();
      setIsNotificationsSidebarVisible(false);
      trackingPlugin.trackClick({
        type: 'action',
        name: tracking.open,
      });
    } else {
      closeAccountSidebar();
    }
  }, [trackingPlugin]);

  useEffect(() => {
    onToggle(isAccountSidebarOpened);
  }, [isAccountSidebarOpened]);

  useClickAway(ref, handleRootClose);

  return (
    <div className={`oui-navbar-dropdown ${style.selectable}`} ref={ref}>
      <UserAccountMenuButton
        show={isAccountSidebarOpened}
        onClick={onUserAccountMenuButtonClick}
        disabled={!isReady}
      >
        <span slot="start" className={style.userIcon}>
          <OsdsIcon
            name={ODS_ICON_NAME.USER}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_ICON_SIZE.sm}
            aria-hidden="true"
          ></OsdsIcon>
        </span>
        {isReady ? (
          <UserName size={ODS_TEXT_SIZE._400}/>
        ) : (
          <OsdsSkeleton inline={true} size={ODS_SKELETON_SIZE.xs} />
        )}
      </UserAccountMenuButton>
      {isAccountSidebarOpened && (
        <UserAccountMenuContent />
      )}
    </div>
  );
};

export default UserAccountMenu;
