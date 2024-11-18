import React from 'react';
import { Navigate, Route, useLocation, useParams } from 'react-router-dom';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

function Rewrite({ to }: { to: string }): JSX.Element {
  const location = useLocation();
  const params = useParams();
  let target = (to || '').replace(
    /:[^/]+/g,
    (id) => params[id.replace(/:|\?/g, '')],
  );
  target = target.replace(/\*/g, params['*']);
  return <Navigate to={`${target}${location.search}`} replace={true} />;
}

export function Redirections(): JSX.Element {
  const {data} = useFeatureAvailability(['new-account']);
  const isAppAvailable = !!data?.['new-account'];

  return (
    <>
      {isAppAvailable ? (
        <>
          <Route
            path="/useraccount/*"
            element={<Rewrite to="/account/useraccount/*" />}
          />
          <Route
            path="/dedicated/useraccount/*"
            element={<Rewrite to="/account/useraccount/*" />}
          />
          <Route
            path="/dedicated/contacts/*"
            element={<Rewrite to="/account/contacts/*" />}
          />
          <Route
            path="/dedicated/identity-documents/*"
            element={<Rewrite to="/account/identity-documents/*" />}
          />
          <Route
            path="/dedicated/documents/*"
            element={<Rewrite to="/account/documents/*" />}
          />
        </>
      ) : (
        <Route
          path="/useraccount/*"
          element={<Rewrite to="/dedicated/useraccount/*" />}
        />
      )}
      <Route
        path="/billing/*"
        element={<Rewrite to="/dedicated/billing/*" />}
      />
      <Route path="/freefax">
        <Route path=":id/*" element={<Rewrite to="/telecom/freefax/:id/*" />} />
        <Route index element={<Rewrite to="/telecom/freefax/" />} />
      </Route>
      <Route path="/pack">
        <Route path=":id/*" element={<Rewrite to="/telecom/pack/:id/*" />} />
        <Route index element={<Rewrite to="/telecom/pack/" />} />
      </Route>
      <Route path="/sms">
        <Route path=":id/*" element={<Rewrite to="/telecom/sms/:id/*" />} />
        <Route index element={<Rewrite to="/telecom/sms/" />} />
      </Route>
      <Route path="/task" element={<Rewrite to="/telecom/task" />} />
      <Route path="/telephony">
        <Route
          path=":id/*"
          element={<Rewrite to="/telecom/telephony/:id/*" />}
        />
        <Route index element={<Rewrite to="/telecom/telephony/" />} />
      </Route>
      <Route path="/orders" element={<Rewrite to="/telecom/orders" />} />
      <Route path="/overTheBox">
        <Route
          path=":id/*"
          element={<Rewrite to="/telecom/overTheBox/:id/*" />}
        />
        <Route index element={<Rewrite to="/telecom/overTheBox/" />} />
      </Route>
    </>
  );
}

export default {
  Redirections,
};
