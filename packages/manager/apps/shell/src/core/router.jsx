import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter,
  Redirect,
  Route,
  Switch,
  useHistory,
  useParams,
} from 'react-router-dom';
import Application from './application';

function RouteHandler(props) {
  const { appId, '0': appHash } = useParams();
  const history = useHistory();
  const { app } = props;

  useEffect(() => {
    app.addHashChangeListener(() => {
      const { applicationId, applicationHash } = app.getApplicationRouting();
      history.replace({ pathname: `/${applicationId}${applicationHash}` });
    });
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

export function initRouter(element, iframe) {
  const application = new Application(iframe);
  application.listenForChanges();
  ReactDOM.render(
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <DefaultRouteHandler />
        </Route>
        <Route path="/:appId/(.*)">
          <RouteHandler app={application} />
        </Route>
      </Switch>
    </HashRouter>,
    element,
  );
}

export default { initRouter };
