import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { plugin, IFrameMessageBus } from '@ovh-ux/shell';
import { Redirect, Route } from 'react-router-dom';
import ApplicationContext from '@/context';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import NavReshuffleFeedbackWidget from './feedback';
import Header from './header';
import Sidebar from './sidebar';
import NavReshuffleOnboardingWidget from './onboarding';

import style from './template.module.scss';
import Progress from '../common/Progress';
import { useProgress } from '@/context/progress';
import Preloader from '../common/Preloader';
import usePreloader from '../common/Preloader/usePreloader';
import LiveChat from '@/components/LiveChat';

function NavReshuffleContainer(): JSX.Element {
  const iframeRef = useRef(null);
  const [iframe, setIframe] = useState(null);
  const [router, setRouter] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const { shell } = useContext(ApplicationContext);
  const { isStarted: isProgressAnimating } = useProgress();

  const preloaderVisible = usePreloader(shell);

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
        component={({ location }: { location: Location }) => (
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

    // billing redirection, preserving path and search params
    routing.addRoute(
      <Route
        path="/billing"
        component={({ location }: { location: Location }) => (
          <Redirect
            to={{
              ...location,
              pathname: location.pathname.replace(
                /^\/billing/,
                '/dedicated/billing',
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
    <div className={style.navReshuffle}>
      {router}
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
          <Preloader visible={preloaderVisible}>
            <iframe
              title="app"
              role="document"
              src="about:blank"
              ref={iframeRef}
            ></iframe>
          </Preloader>
        </div>
        <Suspense fallback="">
          {!productNavReshuffle.isLoading && <NavReshuffleOnboardingWidget />}
          <NavReshuffleFeedbackWidget />
        </Suspense>
      </div>
    </div>
  );
}

export default NavReshuffleContainer;
