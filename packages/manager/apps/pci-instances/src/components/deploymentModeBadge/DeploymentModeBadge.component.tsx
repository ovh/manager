import { Badge } from '@ovhcloud/ods-react';
import { TDeploymentMode } from '@/types/instance/common.type';

const getBadgeClassName = (mode: TDeploymentMode) => {
  switch (mode) {
    case '1AZ':
      return 'bg-[--ods-color-information-400] text-[--ods-color-information-000]';
    case '3AZ':
      return 'bg-[--ods-color-information-700] text-[--ods-color-information-000]';
    case 'LZ':
      return 'bg-[--ods-color-information-100] text-[--ods-color-information-700]';
    default:
      return 'bg-[--ods-color-information-400] text-[--ods-color-information-000]';
  }
};

type TDeploymentModeBadgeProps = {
  mode: TDeploymentMode;
};

export const DeploymentModeBadge = ({ mode }: TDeploymentModeBadgeProps) => (
  <Badge className={getBadgeClassName(mode)}>{mode}</Badge>
);
