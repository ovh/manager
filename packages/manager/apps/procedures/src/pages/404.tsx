import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import {
  accountDisable2faRoute,
  exercisingYourRightsRoute,
} from '@/routes/routes';

export default function NotFound(): null {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const redirectMap: Record<string, string> = useMemo(
    () => ({
      [accountDisable2faRoute]: `${accountDisable2faRoute}${search || ''}`,
      [exercisingYourRightsRoute]: `${exercisingYourRightsRoute}${search ||
        ''}`,
    }),
    [search],
  );

  useEffect(() => {
    const matchedRoute = Object.keys(redirectMap).find((route) =>
      pathname.startsWith(route),
    );
    if (matchedRoute) {
      navigate(redirectMap[matchedRoute], { replace: true });
    } else {
      window.location.assign('https://www.ovhcloud.com');
    }
  }, []);

  return null;
}
