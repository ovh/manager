import { PropsWithChildren } from 'react';
import { Link, LinkProp } from '@ovhcloud/ods-react';

type GuideLinkProps = PropsWithChildren<
  LinkProp & React.AnchorHTMLAttributes<HTMLAnchorElement>
>;

const GuideLink = ({ children, ...props }: GuideLinkProps) => (
  <Link
    className="mb-6 visited:text-[var(--ods-color-primary-500)]"
    role="link"
    target="_blank"
    {...props}
  >
    {children}
  </Link>
);

export default GuideLink;
