import React, { RefObject, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { matchRoutes, useLocation } from 'react-router-dom';
import routes from "./routes";

type Props = {
  iframeRef: RefObject<HTMLIFrameElement>,
  applicationLoading: boolean,
  pageLoading: boolean,
};

const AppLogger = ({ iframeRef, applicationLoading, pageLoading }: Props): JSX.Element => {
  const { t } = useTranslation('accessibility-app-logger');
  const logRef = useRef<HTMLDivElement>();
  const location = useLocation();

  useEffect(() => {
    if (logRef.current && iframeRef.current) {
      if (applicationLoading) {
        logRef.current.innerText = t('accessibility_app_logger_loading');
      } else {
        logRef.current.innerText = t('accessibility_app_logger_loaded');
        iframeRef.current.contentWindow.focus();
      }
    }

  }, [logRef, applicationLoading, iframeRef]);

  useEffect(() => {
    const matchedRoutes = matchRoutes(routes.map((route) => ({ path: route })), location);
    if (matchedRoutes) {
      if (pageLoading) {
        logRef.current.innerText = t('accessibility_app_logger_loading');
      }
      else {
        logRef.current.innerText = t('accessibility_app_logger_loaded');
        iframeRef.current.contentWindow.focus();
      }
    }

  }, [location, pageLoading]);

  return <div role="log" ref={logRef} tabIndex={-1} style={{ position: "absolute", left: -9999 }}></div>
}
export default AppLogger;
