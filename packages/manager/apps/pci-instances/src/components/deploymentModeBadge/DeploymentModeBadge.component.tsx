import { TDeploymentMode } from '@/types/instance/common.type';
import { Badge } from '@ovhcloud/ods-react';

enum DeploymentMode {
  region = '1-AZ',
  localzone = 'Local Zone',
  'region-3-az' = '3-AZ',
}

const getBadgeClassName = (mode: TDeploymentMode) => {
  switch (mode) {
    case 'region':
      return 'bg-[--ods-color-information-400] text-[--ods-color-information-000]';
    case 'region-3-az':
      return 'bg-[--ods-color-information-700] text-[--ods-color-information-000]';
    case 'localzone':
      return 'bg-[--ods-color-information-100] text-[--ods-color-information-700]';
    default:
      return 'bg-[--ods-color-information-400] text-[--ods-color-information-000]';
  }
};

type TDeploymentModeBadgeProps = {
  mode: TDeploymentMode;
};

export const DeploymentModeBadge = ({ mode }: TDeploymentModeBadgeProps) => (
  <Badge className={`${getBadgeClassName(mode)} text-nowrap`}>
    {DeploymentMode[mode]}
  </Badge>
);
