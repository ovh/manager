import React, { useEffect, useMemo } from 'react';
import {
  HashRouter,
  Redirect,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import Orchestrator from './orchestrator';
import RoutingConfiguration from './configuration';

export const hashChangeEvent = 'ovh-routing-hash-change';

interface RouteHandlerProps {
  orchestrator: Orchestrator;
}

interface RouterProps {
  orchestrator: Orchestrator;
  routing: RoutingConfiguration;
  routes: React.ReactElement<Route | Redirect>[];
}

interface DefaultRouteHandlerProps {
  routing: RoutingConfiguration;
}

function URLSynchronizer(props: RouteHandlerProps): JSX.Element {
  const { orchestrator } = props;
  const location = useLocation();

  // Iframe URL updated => update container URL
  useEffect(() => {
    window.addEventListener(
      hashChangeEvent,
      () => orchestrator.updateContainerURL(),
      false,
    );
  }, []);

  // Container URL updated => update iframe URL
  useEffect(() => orchestrator.updateIframeURL(), [location]);

  return null;
}

function DefaultRouteHandler(props: DefaultRouteHandlerProps) {
  return <Redirect to={`/${props.routing.getDefault().id}/`} />;
}

function Router(props: RouterProps) {
  const routes = useMemo(
    () =>
      props.routes.map((route: React.ReactElement<Route | Redirect>, index) => {
        return <route.type {...route.props} key={index} />;
      }),
    [props.routes],
  );
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <DefaultRouteHandler routing={props.routing} />
        </Route>
        {routes}
      </Switch>
      <URLSynchronizer orchestrator={props.orchestrator} />
    </HashRouter>
  );
}

export default Router;
