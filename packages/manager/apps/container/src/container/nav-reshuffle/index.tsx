import { lazy, Suspense, useEffect, useRef, useState } from 'react';

import { IFrameMessageBus } from '@ovh-ux/shell';
import { IFrameAppRouter } from '@/core/routing';
import { useShell } from '@/context';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import Header from './header';
import Sidebar from './sidebar';
import NavReshuffleOnboardingWidget from './onboarding';
import style from './template.module.scss';
import Progress from '../common/Progress';
import { useProgress } from '@/context/progress';
import useMfaEnrollment from '@/container/mfa-enrollment';
import MfaEnrollment from '@/container/mfa-enrollment/MfaEnrollment';
import { ContainerProps } from '@/types/container';
import usePreloader from '@/context/preloader/usePreloader';

const ModalContainer = lazy(() => import('@/components/modal-container/ModalContainer.component'));

function NavReshuffleContainer({ isCookiePolicyModalClosed }: ContainerProps): JSX.Element {
  const iframeRef = useRef(null);
  const shell = useShell();
  const { isStarted: isProgressAnimating } = useProgress();
  // TODO: handle environment unavailability in MANAGER-19971
  const applications = shell
    .getPlugin('environment')
    ?.getEnvironment()
    .getApplications();

  const { show: preloaderVisible, setIframe } = usePreloader();

  const {
    isMfaEnrollmentForced,
    isMfaEnrollmentVisible,
    hideMfaEnrollment,
  } = useMfaEnrollment();

  const productNavReshuffle = useProductNavReshuffle();
  const {
    isNavigationSidebarOpened,
    openNavigationSidebar,
    closeNavigationSidebar,
    skipToTheMainContentSlot
  } = productNavReshuffle;

  const onHamburgerMenuClick = () => {
    if (isNavigationSidebarOpened) {
      closeNavigationSidebar();
    } else {
      openNavigationSidebar();
    }
  };

  useEffect(() => {
    setIframe(iframeRef.current);
    shell.setMessageBus(new IFrameMessageBus(iframeRef.current));
  }, [iframeRef]);

  return (
    <div className={style.navReshuffle}>
      <div ref={skipToTheMainContentSlot} />
      {isCookiePolicyModalClosed && <ModalContainer isPreloaderVisible={preloaderVisible} />}
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
            onHamburgerMenuClick={() => onHamburgerMenuClick()}
            iframeRef={iframeRef}
          />
        </div>
        <div className={style.iframeContainer}>
          {isMfaEnrollmentVisible && (
            <Suspense fallback="">
              <MfaEnrollment
                forced={isMfaEnrollmentForced}
                onHide={hideMfaEnrollment}
              />
            </Suspense>
          )}
          {applications && (
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
          )}
        </div>
        <Suspense fallback="">
          <NavReshuffleOnboardingWidget />
        </Suspense>
      </div>
    </div>
  );
}

export default NavReshuffleContainer;
