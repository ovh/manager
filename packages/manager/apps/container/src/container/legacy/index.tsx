import { lazy, Suspense, useEffect, useRef, useState } from 'react';

import { IFrameMessageBus } from '@ovh-ux/shell';
import { IFrameAppRouter } from '@/core/routing';

import NavReshuffleBetaAccessModal from '@/container/common/pnr-beta-modal';
import { useApplication } from '@/context';
import { useProgress } from '@/context/progress';
import { LegacyContainerProvider } from './legacy.context';
import LegacyHeader from './Header';
import ServerSidebar from './server-sidebar';
import SidebarOverlay from './server-sidebar/SidebarOverlay';
import style from './template.module.scss';
import Progress from '../common/Progress';
import useContainer from '@/core/container';
import useMfaEnrollment from '@/container/mfa-enrollment';
import MfaEnrollment from '@/container/mfa-enrollment/MfaEnrollment';
import { ContainerProps } from '@/types/container';
import usePreloader from '@/context/preloader/usePreloader';

const ModalContainer = lazy(() => import('@/components/modal-container/ModalContainer.component'));

function LegacyContainer({ isCookiePolicyModalClosed }: ContainerProps): JSX.Element {
  const iframeRef = useRef(null);
  const { betaVersion, isReady } = useContainer();

  const { shell } = useApplication();
  const { isStarted: isProgressAnimating } = useProgress();
  const { setIframe, show: preloaderVisible } = usePreloader();
  // TODO: handle environment unavailability in MANAGER-19971
  const applications = shell
    .getPlugin('environment')
    ?.getEnvironment()
    .getApplications();

  const {
    isMfaEnrollmentForced,
    isMfaEnrollmentVisible,
    hideMfaEnrollment,
  } = useMfaEnrollment();

  useEffect(() => {
    setIframe(iframeRef.current);
    shell.setMessageBus(new IFrameMessageBus(iframeRef.current));
  }, [iframeRef]);

  useEffect(() => {
  const tracking = shell.getPlugin('tracking');
    if (betaVersion && isReady) {
      tracking.waitForConfig().then(() => {
        tracking.trackMVTest({
          test: '[product-navigation-reshuffle]',
          waveId: 2,
          creation: '[old-nav]',
        });
      });
    }
  }, [isReady]);

  return (
    <LegacyContainerProvider>
      <>
        <Progress isAnimating={isProgressAnimating}></Progress>
        {isCookiePolicyModalClosed && <ModalContainer isPreloaderVisible={preloaderVisible} />}

        <div className={style.managerShell}>
          <Suspense fallback="">
            <NavReshuffleBetaAccessModal />
          </Suspense>
          <div>
            <LegacyHeader />
          </div>
          <div className={style.managerShell_main}>
            <Suspense fallback="">
              <ServerSidebar />
            </Suspense>
            <div className={style.managerShell_content}>
              <SidebarOverlay />
              {applications && (
                <IFrameAppRouter
                  iframeRef={iframeRef}
                  configuration={applications}
                />
              )}
              {isMfaEnrollmentVisible && (
                <Suspense fallback="">
                  <MfaEnrollment
                    forced={isMfaEnrollmentForced}
                    onHide={hideMfaEnrollment}
                  />
                </Suspense>
              )}
              <iframe
                title="app"
                role="document"
                src="about:blank"
                ref={iframeRef}
              ></iframe>
            </div>
          </div>
        </div>
      </>
    </LegacyContainerProvider>
  );
}

export default LegacyContainer;
