import React, { useContext, useEffect, useRef, useState } from 'react';

import { plugin, shell as shellApi } from '@ovh-ux/shell';

import ApplicationContext from '@/context';
import ShellHeader from './header';
import style from './shell.module.scss';

function Shell() {
  const iframeRef = useRef(null);
  const [iframe, setIframe] = useState(null);
  const [router, setRouter] = useState(null);
  const { environment } = useContext(ApplicationContext);
  let shell = null;

  useEffect(() => {
    shell = shellApi.initShell();
    shell.registerPlugin('i18n', plugin.i18n(environment));
    shell.connectIFrameApplication(iframeRef.current);
  }, []);

  useEffect(() => {
    setIframe(iframeRef.current);
  }, [iframeRef]);

  useEffect(() => {
    const routing = plugin.routing.initRouting(iframeRef.current);
    shell.registerPlugin('routing', routing);
    setRouter(routing.router);
  }, [iframeRef, shell]);

  return (
    <div className={style.managerShell}>
      {router}
      <div className={style.managerShell_header}>
        <ShellHeader />
      </div>
      <div className={style.managerShell_content}>
        <iframe src="about:blank" ref={iframeRef}></iframe>
      </div>
      <div className={style.managerShell_footer}></div>
    </div>
  );
}

export default Shell;
