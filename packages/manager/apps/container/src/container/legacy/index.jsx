import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  Suspense,
} from 'react';

import { plugin, IFrameMessageBus } from '@ovh-ux/shell';
import ApplicationContext from '@/context';
import NavReshuffleBetaAccessModal from '@/container/common/pnr-beta-modal';
import style from './template.module.scss';

import LegacyHeader from './header';

function LegacyContainer() {
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

  return (
    <div className={style.managerShell}>
      {router}
      <Suspense fallback="">
        <NavReshuffleBetaAccessModal />
      </Suspense>
      <div className={style.managerShell_header}>
        <LegacyHeader />
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
    </div>
  );
}

export default LegacyContainer;
