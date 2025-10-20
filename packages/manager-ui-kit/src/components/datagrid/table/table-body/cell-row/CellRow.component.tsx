import React from 'react';
import { BADGE_COLOR } from '@ovhcloud/ods-react';
import { Badge } from '../../../../badge';
import { Link } from '../../../../Link';
import { Text } from '../../../../text';
import { ColumnMetaType } from '../../../Datagrid.props';

export const CellRow = ({
  badgeColor,
  children,
  className,
  href,
  onClick,
  type,
}: {
  badgeColor?: BADGE_COLOR;
  children?: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type: ColumnMetaType;
}) => {
  if (type === 'text') {
    return <Text className={className}>{children}</Text>;
  }
  if (type === 'link') {
    return (
      <Link onClick={onClick} className={className} href={href}>
        {children as string}
      </Link>
    );
  }
  if (type === 'badge') {
    return (
      <Badge className={className} {...(badgeColor && { color: badgeColor })}>
        {children}
      </Badge>
    );
  }
  return className ? (
    <div className={className}>{children}</div>
  ) : (
    <>{children}</>
  );
};
