import { useUserContext } from '@/context/user/useUser';
import { urls } from '@/routes/routes.constant';
import { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type InvalidationRedirectGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export default function InvalidationRedirectGuard({
  children,
  fallback = null,
}: InvalidationRedirectGuardProps): ReactNode {
  const { legalForm } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (legalForm === 'other') {
      navigate(urls.accountType, { replace: true });
    }
  }, [legalForm, navigate]);

  if (!legalForm || legalForm === 'other') {
    return fallback;
  }

  return children;
}
