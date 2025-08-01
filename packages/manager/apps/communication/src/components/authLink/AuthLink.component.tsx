import { ManagerLink } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';

/**
 * Should be replaced by OdsLink in ODS v19
 */
export default function AuthLink({
  href,
  children,
  iamActions,
  urn,
}: {
  href: string;
  children?: string;
  iamActions?: string[];
  urn?: string;
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
        navigate(href);
      }}
    >
      {children}
    </ManagerLink>
  );
}
