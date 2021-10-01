import React, { useEffect } from 'react';
import {
  HashRouter,
  Redirect,
  Route,
  Switch,
  useHistory,
  useParams,
} from 'react-router-dom';
import Application from './application';

export const hashChangeEvent = 'ovh-routing-hash-change';

interface RouteHandlerProps {
  app: Application;
}

interface RouteHandlerParams {
  appId: string;
  '0': string;
}

interface RouterProps {
  iframe: HTMLIFrameElement;
}

function RouteHandler(props: RouteHandlerProps): JSX.Element {
  const { appId, '0': appHash } = useParams<RouteHandlerParams>();
  const { app } = props;

  const history = useHistory();
  useEffect(() => {
    window.addEventListener(
      hashChangeEvent,
      () => {
        const { applicationId, applicationHash } = app.getApplicationRouting();
        history.replace({ pathname: `/${applicationId}${applicationHash}` });
      },
      false,
    );
  }, []);

  app.updateRouting({
    applicationId: appId,
    applicationHash: appHash,
  });

  return null;
}

function DefaultRouteHandler() {
  if (window.location.hostname === 'localhost') {
    return <Redirect to="/app/" />;
  }
  return <Redirect to="/hub/" />;
}

function Router(props: RouterProps) {
  const application = new Application(props.iframe);
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <DefaultRouteHandler />
        </Route>
        <Route path="/:appId/(.*)">
          <RouteHandler app={application} />
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default Router;
