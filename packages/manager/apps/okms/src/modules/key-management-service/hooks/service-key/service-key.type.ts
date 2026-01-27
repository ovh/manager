import { BUTTON_COLOR, ICON_NAME } from '@ovhcloud/ods-react';

import { ButtonProps } from '@ovh-ux/muk';

export type ServiceKeyAction = {
  label: string;
  color: BUTTON_COLOR;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  iamActions?: ButtonProps['iamActions'];
  urn?: ButtonProps['urn'];
  icon: ICON_NAME;
  buttonId:
    | 'service-key-download_encryption_key'
    | 'service-key-deactivate_encryption_key'
    | 'service-key-reactivate_encryption_key'
    | 'service-key-delete_encryption_key';
};
