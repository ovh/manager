import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { IFrameMessageBus } from '@ovh-ux/shell';
import { IFrameAppRouter } from '@/core/routing';
import ApplicationContext from '@/context';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import Header from './header';
import Sidebar from './sidebar';
import NavReshuffleOnboardingWidget from './onboarding';
import EloquantSurvey from './eloquant-survey';

import style from './template.module.scss';
import Progress from '../common/Progress';
import { useProgress } from '@/context/progress';
import Preloader from '../common/Preloader';
import usePreloader from '../common/Preloader/usePreloader';
import useMfaEnrollment from '@/container/mfa-enrollment';
import MfaEnrollment from '@/container/mfa-enrollment/MfaEnrollment';

function NavReshuffleContainer(): JSX.Element {
  const iframeRef = useRef(null);
  const [iframe, setIframe] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const { shell } = useContext(ApplicationContext);
  const { isStarted: isProgressAnimating } = useProgress();
  const applications = shell
    .getPlugin('environment')
    .getEnvironment()
    .getApplications();

  const preloaderVisible = usePreloader(shell, iframe);

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
            onUserAccountMenuToggle={setShowOverlay}
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
          <NavReshuffleOnboardingWidget />
        </Suspense>
        <Suspense fallback="">
          <EloquantSurvey />
        </Suspense>
      </div>
    </div>
  );
}

export default NavReshuffleContainer;
