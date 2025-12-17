import { Link as ManagerLink } from '@ovh-ux/muk';
import { useNavigate } from 'react-router-dom';

/**
 * Should be replaced by OdsLink in ODS v19
 */
export default function AuthLink({
  href,
  children,
  iamActions,
  urn,
  onClick,
}: {
  href: string;
  children?: string;
  iamActions?: string[];
  urn?: string;
  onClick?: () => void;
}) {
  const navigate = useNavigate();
  return (
    <ManagerLink
      href="#"
      label={children}
      iamActions={iamActions}
      urn={urn}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigate(href);
      }}
    >
      {children}
    </ManagerLink>
  );
}
