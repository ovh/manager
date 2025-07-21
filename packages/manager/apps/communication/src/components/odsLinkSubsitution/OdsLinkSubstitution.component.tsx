import { OdsLink } from '@ovhcloud/ods-components/react';
import { Link } from 'react-router-dom';

/**
 * Should be replaced by OdsLink in ODS v19
 */
export default function OdsLinkSubstitution({
  href,
  children,
}: {
  href: string;
  children?: string;
}) {
  return (
    <Link to={href}>
      <OdsLink href="" label={children}>
        {children}
      </OdsLink>
    </Link>
  );
}
