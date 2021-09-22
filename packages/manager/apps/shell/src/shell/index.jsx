import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Router from '@/core/router';
import ShellHeader from './header';
import style from './shell.module.scss';

export function Shell() {
  const iframeRef = useRef(null);
  const [iframe, setIframe] = useState(null);
  useEffect(() => {
    setIframe(iframeRef.current);
  }, [iframeRef]);
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

export function renderShell(element) {
  ReactDOM.render(<Shell />, element);
}

export default {
  Shell,
  renderShell,
};
