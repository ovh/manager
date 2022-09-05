import { useLocation, useNavigate } from 'react-router-dom';

export function IndexRoute(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  if (location.pathname !== '/') {
    navigate('/', { replace: true });
  }
  return undefined;
}

export default { IndexRoute };
