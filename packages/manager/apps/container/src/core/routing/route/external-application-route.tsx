import { useEffect } from 'react';
import { Application } from '@ovh-ux/manager-config';

export interface ExternalApplicationRouteProps {
  appConfig: Application;
}

export function ExternalApplicationRoute({
  appConfig,
}: ExternalApplicationRouteProps): JSX.Element {
  useEffect(() => {
    window.location.replace(appConfig.publicURL);
  }, []);
  return undefined;
}

export default ExternalApplicationRoute;
