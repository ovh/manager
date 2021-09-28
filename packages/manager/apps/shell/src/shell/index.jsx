import React, { useContext, useEffect, useRef, useState } from 'react';

import i18n from '@ovh-ux/shell/plugin/i18n';
import initShell from '@ovh-ux/shell';

import ApplicationContext from '@/context';
import Router from '@/core/router';
import ShellHeader from './header';
import style from './shell.module.scss';

function Shell() {
  const iframeRef = useRef(null);
  const [iframe, setIframe] = useState(null);
  const { environment } = useContext(ApplicationContext);

  useEffect(() => {
    setIframe(iframeRef.current);
  }, [iframeRef]);

  useEffect(() => {
    const shell = initShell();
    shell.registerPlugin('i18n', i18n(environment));
    shell.connectApi(iframeRef.current);
    return () => shell.disconnectApi();
  }, []);

  return (
    <div className={style.managerShell}>
      {iframe && <Router iframe={iframe} />}
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
