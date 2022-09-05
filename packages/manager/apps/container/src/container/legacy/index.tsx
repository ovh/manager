import React, {
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
import LegacyHeader from './Header';
import style from './template.module.scss';
import Progress from '../common/Progress';
import Preloader from '../common/Preloader';
import usePreloader from '../common/Preloader/usePreloader';
import useContainer from '@/core/container';

function LegacyContainer(): JSX.Element {
  const iframeRef = useRef(null);
  const [iframe, setIframe] = useState<HTMLIFrameElement>(null);
  const { betaVersion } = useContainer();

  const { shell } = useContext(ApplicationContext);
  const { isStarted: isProgressAnimating } = useProgress();
  const preloaderVisible = usePreloader(shell);
  const applications = shell
    .getPlugin('environment')
    .getEnvironment()
    .getApplications();

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
          waveId: 1,
          creation: '[old-nav]',
        });
      });
    }
  }, []);

  return (
    <>
      <Progress isAnimating={isProgressAnimating}></Progress>

      <div className={style.managerShell}>
        <Suspense fallback="">
          <NavReshuffleBetaAccessModal />
        </Suspense>
        <div className={style.managerShell_header}>
          <LegacyHeader />
        </div>
        <div className={style.managerShell_content}>
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
      </div>
    </>
  );
}

export default LegacyContainer;
