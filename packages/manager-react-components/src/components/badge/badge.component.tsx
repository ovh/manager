
import { Badge as OdsBadge, Skeleton } from '@ovhcloud/ods-react';
import { BadgeProps } from './badge.props';

export const Badge = ({ children, isLoading, ...props }: BadgeProps) => {
  return isLoading ? (
    <Skeleton data-testid={`${props['data-testid']}`} />
  ) : (
    <OdsBadge {...props}>{children}</OdsBadge>
  );
};
