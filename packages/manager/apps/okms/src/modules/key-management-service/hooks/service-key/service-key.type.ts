import { ComponentProps } from 'react';

import { ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { ManagerButtonProps } from '@ovh-ux/manager-react-components';

type OdsButtonProps = ComponentProps<typeof OdsButton>;

export type ServiceKeyAction = {
  name: string;
  label: OdsButtonProps['label'];
  color: ODS_BUTTON_COLOR;
  onClick: () => void;
  isDisabled?: OdsButtonProps['isDisabled'];
  isLoading?: OdsButtonProps['isLoading'];
  iamActions?: ManagerButtonProps['iamActions'];
  urn?: ManagerButtonProps['urn'];
  icon: OdsButtonProps['icon'];
};
