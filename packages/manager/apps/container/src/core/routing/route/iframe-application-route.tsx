import { useEffect, useState, RefObject } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { Application } from '@ovh-ux/manager-config/types/application';

import { appendSlash, removeHashbang } from './utils';

export interface IFrameApplicationRouteProps {
  iframeRef: RefObject<HTMLIFrameElement>;
  appConfig: Application;
}

export function IFrameApplicationRoute({
  iframeRef,
  appConfig,
}: IFrameApplicationRouteProps): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const [newIFrameURL, setNewIframeURL] = useState(null);
  const [iframeLocation, setIframeLocation] = useState(null);

  const containerURLMatcher = useMatch('/:appPath/*');

  // ensure that iframe is accessible (same origin)
  if (iframeRef.current) {
    try {
      iframeRef.current.contentWindow.location.toString();
    } catch (error) {
      navigate('/', { replace: true });
    }
  }

  // when container's url is updated, update the iframe href
  const onContainerLocationChange = () => {
    let hashPart = '';
    if (containerURLMatcher?.params) {
      hashPart = (containerURLMatcher.params as Record<string, string>)['*'];
    }
    const newURL = new URL(appendSlash(appConfig.url));
    newURL.hash = `/${hashPart}${location.search}`;
    setNewIframeURL(newURL.href);
  };

  // perform the href update of the iframe element
  const onSetIFrameURL = () => {
    if (iframeRef.current && newIFrameURL !== null) {
      const {
        location: currentIframeLocation,
      } = iframeRef.current.contentWindow;
      if (currentIframeLocation.href !== newIFrameURL) {
        currentIframeLocation.replace(newIFrameURL);
      }
    }
  };

  // when iframe's location changed, update the container's url
  const onIFrameLocationChanged = () => {
    if (iframeRef.current && iframeLocation !== null) {
      const newHash = `/${appConfig.container.path}${removeHashbang(
        iframeLocation.hash,
      )}`;
      const oldHash = `${location.pathname}${location.search}`;
      if (newHash !== oldHash) {
        navigate(newHash, { replace: true });
      }
    }
  };

  useEffect(onContainerLocationChange, [location]);
  useEffect(onSetIFrameURL, [newIFrameURL, iframeRef]);
  useEffect(onIFrameLocationChanged, [iframeLocation, iframeRef]);

  // listen for iframe location changes
  useEffect(() => {
    const onIframeHashUpdate = () =>
      setIframeLocation({ ...iframeRef.current.contentWindow.location });
    window.addEventListener('ovh-routing-hash-change', onIframeHashUpdate);
    return () =>
      window.removeEventListener('ovh-routing-hash-change', onIframeHashUpdate);
  }, []);

  return undefined;
}

export default IFrameApplicationRoute;
