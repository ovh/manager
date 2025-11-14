import { useSearchParams } from 'react-router-dom';
import { sanitizeUrl } from '@/helpers/sanitization/sanitizationHelper';

export const useRedirectToLoginUrl = () => {
  const [searchParams] = useSearchParams();
  const loginUrl = searchParams.get('login');

  return sanitizeUrl(loginUrl);
};

export const useRedirectToSignUpUrl = () => {
  const [searchParams] = useSearchParams();
  const signUpUrl = searchParams.get('signup');

  return sanitizeUrl(signUpUrl);
};
