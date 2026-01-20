import { PropsWithChildren } from 'react';
import { Icon, Link, LinkProp } from '@ovhcloud/ods-react';

type GuideLinkProps = PropsWithChildren<
  { withIcon?: boolean } & LinkProp &
    React.AnchorHTMLAttributes<HTMLAnchorElement>
>;

const GuideLink = ({ children, withIcon = true, ...props }: GuideLinkProps) => (
  <Link
    className="mb-6 max-w-full visited:text-[var(--ods-color-primary-500)]"
    role="link"
    target="_blank"
    {...props}
  >
    {children}
    {withIcon && <Icon name="arrow-right" />}
  </Link>
);

export default GuideLink;
