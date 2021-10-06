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
import RoutingConfiguration from './configuration';

export const hashChangeEvent = 'ovh-routing-hash-change';

interface RouteHandlerProps {
  app: Application;
}

interface RouteHandlerParams {
  appId: string;
  '0': string;
}

interface RouterProps {
  application: Application;
  routing: RoutingConfiguration;
}

interface DefaultRouteHandlerProps {
  routing: RoutingConfiguration;
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

  try {
    app.updateRouting({
      applicationId: appId,
      applicationHash: appHash,
    });
  } catch (error) {
    console.error(error);
  }

  return null;
}

function DefaultRouteHandler(props: DefaultRouteHandlerProps) {
  return <Redirect to={`/${props.routing.getDefault().id}/`} />;
}

function Router(props: RouterProps) {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <DefaultRouteHandler routing={props.routing} />
        </Route>
        <Route path="/:appId/(.*)">
          <RouteHandler app={props.application} />
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default Router;
