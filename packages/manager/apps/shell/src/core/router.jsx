import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
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

function Router(props) {
  const application = new Application(props.iframe);
  application.listenForChanges();
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

Router.propTypes = {
  iframe: PropTypes.instanceOf(HTMLIFrameElement).isRequired,
};

export default Router;
