import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { plugin, IFrameMessageBus } from '@ovh-ux/shell';

import useCookieModal from '../cookie-policy/useCookieModal';
import CookiePolicy from '../cookie-policy/CookiePolicy';

import ApplicationContext from '../context';

import ShellHeader from './header';
import style from './shell.module.scss';

function Shell() {
  const iframeRef = useRef(null);
  const [iframe, setIframe] = useState(null);
  const [router, setRouter] = useState(null);
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

  const cookieModalRef = useCookieModal(shell);

  return (
    <div className={style.managerShell}>
      {router}
      <div className={style.managerShell_header}>
        <ShellHeader />
      </div>
      <div className={style.managerShell_content}>
        <iframe
          label="app"
          role="document"
          src="about:blank"
          ref={iframeRef}
        ></iframe>
      </div>
      <div className={style.managerShell_footer}></div>
      <Suspense fallback="...">
        <CookiePolicy shell={shell} ref={cookieModalRef} />
      </Suspense>
    </div>
  );
}

export default Shell;
