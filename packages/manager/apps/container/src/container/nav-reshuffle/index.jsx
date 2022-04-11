import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  Suspense,
} from 'react';
import { Redirect, Route } from 'react-router-dom';
import { plugin, IFrameMessageBus } from '@ovh-ux/shell';
import ApplicationContext from '@/context';

import Header from './header';
import Sidebar from './sidebar';
import NavReshuffleFeedbackWidget from './feedback';

import style from './template.module.scss';

function NavReshuffleContainer() {
  const iframeRef = useRef(null);
  const [iframe, setIframe] = useState(null);
  const [router, setRouter] = useState(null);
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const { shell } = useContext(ApplicationContext);

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
        className={`${style.sidebar} ${isSidebarExpanded ? '' : style.hidden}`}
      >
        <Suspense fallback="">
          <Sidebar />
        </Suspense>
      </div>
      <div className={`${style.container}`}>
        <div className={style.navbar}>
          <Header
            isSidebarExpanded={isSidebarExpanded}
            onHamburgerMenuClick={() => setSidebarExpanded(!isSidebarExpanded)}
            onUserAccountMenuToggle={setShowOverlay}
          />
        </div>
        <div className={style.iframeContainer}>
          <div
            className={`${style.iframeOverlay} ${
              isSidebarExpanded || showOverlay
                ? style.iframeOverlay_visible
                : ''
            }`}
          ></div>
          <iframe
            label="app"
            role="document"
            src="about:blank"
            ref={iframeRef}
          ></iframe>
          <Suspense fallback="">
            <NavReshuffleFeedbackWidget />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default NavReshuffleContainer;
