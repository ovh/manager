import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { plugin, IFrameMessageBus } from '@ovh-ux/shell';
import { Redirect, Route } from 'react-router-dom';

import NavReshuffleBetaAccessModal from '@/container/common/pnr-beta-modal';
import ApplicationContext from '@/context';
import { useProgress } from '@/context/progress';
import CookiePolicy from '@/cookie-policy/CookiePolicy';
import SSOAuthModal from '@/sso-auth-modal/SSOAuthModal';
import LegacyHeader from './Header';
import style from './template.module.scss';
import Progress from '../common/Progress';
import Preloader from '../common/Preloader';
import usePreloader from '../common/Preloader/usePreloader';

function LegacyContainer(): JSX.Element {
  const iframeRef = useRef(null);
  const [iframe, setIframe] = useState(null);
  const [router, setRouter] = useState(null);
  const { shell } = useContext(ApplicationContext);
  const { isStarted: isProgressAnimating } = useProgress();
  const preloaderVisible = usePreloader(shell);

  useEffect(() => {
    setIframe(iframeRef.current);
    shell.setMessageBus(new IFrameMessageBus(iframeRef.current));
  }, [iframeRef]);

  useEffect(() => {
    const routing = plugin.routing.initRouting(shell, iframeRef.current);

    // Hub application redirections
    routing.addRoute(
      <Route exact path="/catalog">
        <Redirect to="/hub/catalog" />
      </Route>,
    );

    // useraccount redirection, preserving path and search params
    routing.addRoute(
      <Route
        path="/useraccount"
        component={({ location }) => (
          <Redirect
            to={{
              ...location,
              pathname: location.pathname.replace(
                /^\/useraccount/,
                '/dedicated/useraccount',
              ),
            }}
          />
        )}
      />,
    );

    // Telecom application redirections
    [
      'freefax/:id?',
      'pack/:id?',
      'sms/:id?',
      'task',
      'telephony/:id?',
      'orders',
      'overTheBox/:id?',
    ].forEach((telecomRoute) =>
      routing.addRoute(
        <Redirect from={`/${telecomRoute}`} to={`/telecom/${telecomRoute}`} />,
      ),
    );

    shell.registerPlugin('routing', routing);
    setRouter(routing.router);
  }, [iframeRef, shell]);

  return (
    <>
      <Progress isAnimating={isProgressAnimating}></Progress>

      <div className={style.managerShell}>
        {router}
        <Suspense fallback="">
          <NavReshuffleBetaAccessModal />
        </Suspense>
        <div className={style.managerShell_header}>
          <LegacyHeader />
        </div>
        <div className={style.managerShell_content}>
          <Preloader visible={preloaderVisible}>
            <iframe
              label="app"
              role="document"
              src="about:blank"
              ref={iframeRef}
            ></iframe>
          </Preloader>
        </div>
        <Suspense fallback="">
          <SSOAuthModal />
        </Suspense>
        <div className={style.managerShell_footer}></div>
        <Suspense fallback="...">
          <CookiePolicy shell={shell} />
        </Suspense>
      </div>
    </>
  );
}

export default LegacyContainer;
