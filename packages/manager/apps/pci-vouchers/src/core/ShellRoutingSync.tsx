import { useRouting } from '@ovh-ux/manager-react-shell-client';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ShellRoutingSync() {
  const location = useLocation();
  // const navigate = useNavigate();
  // const matches: any = matchRoutes(routes, { pathname: location.pathname });

  const routing = useRouting();
  useEffect(() => {
    routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    routing.onHashChange();
    // if (matches && matches[matches.length - 1].route?.element === undefined) {
    //   navigate('/');
    // }
  }, [location]);
  return null;
}
