import { FC } from 'react';
import { Badge, BadgeProp, Text } from '@ovhcloud/ods-react';

type TSelectOptionRowProps = {
  label: string;
  badge?: string;
  badgeProps?: BadgeProp;
};

const SelectOptionRow: FC<TSelectOptionRowProps> = ({
  label,
  badge,
  badgeProps,
}) => (
  <div className="flex w-full items-center justify-between gap-x-6">
    <Text>{label}</Text>
    {badge && <Badge {...badgeProps}>{badge}</Badge>}
  </div>
);

export default SelectOptionRow;
