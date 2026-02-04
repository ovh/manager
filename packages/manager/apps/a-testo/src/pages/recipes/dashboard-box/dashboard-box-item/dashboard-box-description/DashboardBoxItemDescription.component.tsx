import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { DashboardBoxDivider } from '../../dashboard-box-divider/DashboardBoxDivider.component';
import { DashboardBoxItemDescriptionProps } from './DashboardBoxItemDescription.props';

export const DashboardBoxItemDescription = ({
  label,
  children,
  divider = true,
  ...rest
}: DashboardBoxItemDescriptionProps) => {
  return (
    <dd className="m-0" {...rest}>
      {label && <Text preset={TEXT_PRESET.span}>{label}</Text>}
      {children}
      {divider && <DashboardBoxDivider />}
    </dd>
  );
};
