import {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { IFrameMessageBus } from '@ovh-ux/shell';
import { IFrameAppRouter } from '@/core/routing';

import NavReshuffleBetaAccessModal from '@/container/common/pnr-beta-modal';
import ApplicationContext from '@/context';
import { useProgress } from '@/context/progress';
import { LegacyContainerProvider } from './context';
import LegacyHeader from './Header';
import ServerSidebar from './server-sidebar';
import SidebarOverlay from './server-sidebar/SidebarOverlay';
import style from './template.module.scss';
import Progress from '../common/Progress';
import Preloader from '../common/Preloader';
import usePreloader from '../common/Preloader/usePreloader';
import useContainer from '@/core/container';
import useMfaEnrollment from '@/container/mfa-enrollment';
import MfaEnrollment from '@/container/mfa-enrollment/MfaEnrollment';

function LegacyContainer(): JSX.Element {
  const iframeRef = useRef(null);
  const [iframe, setIframe] = useState<HTMLIFrameElement>(null);
  const { betaVersion } = useContainer();

  const { shell } = useContext(ApplicationContext);
  const { isStarted: isProgressAnimating } = useProgress();
  const preloaderVisible = usePreloader(shell, iframe);
  const applications = shell
    .getPlugin('environment')
    .getEnvironment()
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
    if (betaVersion) {
      tracking.waitForConfig().then(() => {
        tracking.trackMVTest({
          test: '[product-navigation-reshuffle]',
          waveId: 2,
          creation: '[old-nav]',
        });
      });
    }
  }, []);

  return (
    <LegacyContainerProvider>
      <>
        <Progress isAnimating={isProgressAnimating}></Progress>

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
              <Preloader visible={preloaderVisible}>
                <>
                  <IFrameAppRouter
                    iframeRef={iframeRef}
                    configuration={applications}
                  />
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
                </>
              </Preloader>
            </div>
          </div>
        </div>
      </>
    </LegacyContainerProvider>
  );
}

export default LegacyContainer;
