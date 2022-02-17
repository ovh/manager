import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  Suspense,
} from 'react';
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
    const routing = plugin.routing.initRouting(iframeRef.current);
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
