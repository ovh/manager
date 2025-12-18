import { useState, Suspense } from 'react';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import HamburgerMenu from './HamburgerMenu';
import UserAccountMenu from './user-account-menu';

import CloudShellLink from '@/container/common/cloud-shell';
import LanguageMenu from '@/container/common/language';
import modalStyle from '@/container/common/modal.module.scss';
import NavReshuffleSwitchBack from '@/container/common/nav-reshuffle-switch-back';
import NotificationsSidebar from '@/container/common/notifications-sidebar';
import Notifications from '@/container/common/notifications-sidebar/NotificationsButton';
import ApplicationContext, { useShell } from '@/context';
import { useHeader } from '@/context/header';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import { Logo } from '@/container/common/Logo';
import SkipToMainContent from './skip-to-main-content';
import { SupportLink } from '../support-link';

import style from './style.module.scss';
import Separator from './Separator.component';

type Props = {
  isSidebarExpanded?: boolean;
  onHamburgerMenuClick?(): void;
  onUserAccountMenuToggle?(show: boolean): void;
  iframeRef: React.MutableRefObject<any>;
};

function Header({
  isSidebarExpanded = false,
  onHamburgerMenuClick = () => {},
  onUserAccountMenuToggle = () => {},
  iframeRef,
}: Props): JSX.Element {
  const shell = useShell();
  const [userLocale, setUserLocale] = useState<string>(
    shell.getPlugin('i18n').getLocale(),
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setIsNotificationsSidebarVisible } = useHeader();
  const { data: cloudShellAvailability } = useFeatureAvailability([
    'cloud-shell',
  ]);
  const navigationPlugin = shell.getPlugin('navigation');
  const logoLink = navigationPlugin.getURL('hub', '#/');
  const { isMobile } = useProductNavReshuffle();

  return (
    <ApplicationContext.Consumer>
      {() => (
        <Suspense fallback="">
          {isDropdownOpen && <div className={modalStyle.popoverClickAway} />}
          <div
            className={`w-full bg-[var(--ods-color-primary-700)] flex flex-row items-center pr-3 md:px-4 ${style.navbar}`}
          >
            <HamburgerMenu
              isOpen={isSidebarExpanded}
              onClick={onHamburgerMenuClick}
            />
            <a
              role="img"
              className={`flex-none block ${style.navbarLogo} ml-2 md:ml-0`}
              aria-label="OVHcloud"
              target="_top"
              href={logoLink}
            >
              <Logo />
            </a>
            <div className="grow flex flex-wrap gap-[0.75rem] items-center w-full justify-end">
              <SkipToMainContent iframeRef={iframeRef} />
              {!isMobile && (
                <>
                  {/* <Separator /> for searchbar separation */}
                  <NavReshuffleSwitchBack />
                  <Separator />
                  <div className="block relative">
                    <LanguageMenu
                      setUserLocale={setUserLocale}
                      userLocale={userLocale}
                      onChange={(show: boolean) => {
                        setIsDropdownOpen(show);
                        setIsNotificationsSidebarVisible(false);
                      }}
                    />
                  </div>
                  <SupportLink />
                </>
              )}
              <div className="flex flex-row items-center gap-[0.5rem]">
                {cloudShellAvailability?.['cloud-shell'] && <CloudShellLink />}
                <Notifications />
                <div className="block relative">
                  <UserAccountMenu
                    onToggle={(show: boolean) => {
                      setIsDropdownOpen(show);
                      onUserAccountMenuToggle(show);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <NotificationsSidebar />
        </Suspense>
      )}
    </ApplicationContext.Consumer>
  );
}

export default Header;
