import { LinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Link from './Link.component';

interface ConditionalLinkProps extends LinkProps {
  condition: boolean;
  disabled?: boolean;
}

const ConditionalLink = ({
  condition,
  className,
  children,
  to,
  ...props
}: ConditionalLinkProps) => {
  if (condition) {
    return (
      <Link to={to} className={className} {...props}>
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
};

export default ConditionalLink;
