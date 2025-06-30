import { ComponentProps } from 'react';
import { OdsBadge, OdsSkeleton } from '@ovhcloud/ods-components/react';
import { Button } from '@ovhcloud/ods-react';

export interface BadgeProps extends ComponentProps<typeof OdsBadge> {
  isLoading?: boolean;
  'data-testid'?: string;
}

export const Badge = ({ isLoading, ...props }: BadgeProps) => {
  return isLoading ? (
    <OdsSkeleton data-testid={`${props['data-testid']}`} />
  ) : (
    <>
      <Button />
      <OdsBadge {...props} />
    </>
  );
};
