import React, { FC, Suspense, memo } from 'react';
import style from './template.module.scss';
import Sidebar from './sidebar';
import Progress from '../common/Progress';
import Header from './header';
import NavReshuffleOnboardingWidget from './onboarding';
import NavReshuffleFeedbackWidget from './feedback';
import Preloader from '../common/Preloader';
import { IFrameAppRouter } from '@/core/routing';
import MfaEnrollment from '../mfa-enrollment/MfaEnrollment';

type NavReshuffleComponent = {
  isNavigationSidebarOpened: boolean;
  isProgressAnimating: boolean;
  isMfaEnrollmentVisible: boolean;
  isMfaEnrollmentForced: boolean;
  preloaderVisible: boolean;
  isLoading: boolean;
  onHamburgerMenuClick: () => void;
  setShowOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  closeNavigationSidebar: () => void;
  hideMfaEnrollment: () => void;
  showOverlay: boolean;
  iframeRef: React.MutableRefObject<any>;
  applications: any;
};

const NavReshuffleComponent: FC<NavReshuffleComponent> = memo(({
  applications,
  preloaderVisible,
  isMfaEnrollmentForced,
  isLoading,
  isMfaEnrollmentVisible,
  isNavigationSidebarOpened,
  isProgressAnimating,
  onHamburgerMenuClick,
  setShowOverlay,
  showOverlay,
  closeNavigationSidebar,
  hideMfaEnrollment,
  iframeRef,
}) => {
  return (
    <div className={style.navReshuffle}>
      <div
        className={`${style.sidebar} ${
          isNavigationSidebarOpened ? '' : style.hidden
        }`}
      >
        <Suspense fallback="">
          <Sidebar />
        </Suspense>
      </div>
      <div className={`${style.container}`}>
        <Progress isAnimating={isProgressAnimating}></Progress>
        <div className={style.navbar}>
          <Header
            isSidebarExpanded={isNavigationSidebarOpened}
            onHamburgerMenuClick={onHamburgerMenuClick}
            onUserAccountMenuToggle={setShowOverlay}
          />
        </div>
        <div className={style.iframeContainer}>
          <div
            className={`${style.iframeOverlay} ${
              isNavigationSidebarOpened || showOverlay
                ? style.iframeOverlay_visible
                : ''
            }`}
            onClick={() =>
              isNavigationSidebarOpened && closeNavigationSidebar()
            }
          ></div>
          {isMfaEnrollmentVisible && (
            <Suspense fallback="">
              <MfaEnrollment
                forced={isMfaEnrollmentForced}
                onHide={hideMfaEnrollment}
              />
            </Suspense>
          )}
          <Preloader visible={preloaderVisible}>
            <>
              <IFrameAppRouter
                iframeRef={iframeRef}
                configuration={applications}
              />
              <iframe
                title="app"
                role="document"
                src="about:blank"
                ref={iframeRef}
              ></iframe>
            </>
          </Preloader>
        </div>
        <Suspense fallback="">
          {!isLoading && <NavReshuffleOnboardingWidget />}
          <NavReshuffleFeedbackWidget />
        </Suspense>
      </div>
    </div>
  );
});

export default NavReshuffleComponent;
