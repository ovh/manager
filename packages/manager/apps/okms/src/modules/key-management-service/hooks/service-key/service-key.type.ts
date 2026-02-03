import { BUTTON_COLOR, ICON_NAME } from '@ovhcloud/ods-react';

import { ButtonProps } from '@ovh-ux/muk';

export type ServiceKeyAction = {
  name: string;
  label: string;
  color: BUTTON_COLOR;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  iamActions?: ButtonProps['iamActions'];
  urn?: ButtonProps['urn'];
  icon: ICON_NAME;
};
