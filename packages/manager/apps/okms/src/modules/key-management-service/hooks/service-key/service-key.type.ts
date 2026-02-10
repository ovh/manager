import { ICON_NAME } from '@ovhcloud/ods-react';

import { ActionMenuItemProps } from '@ovh-ux/muk';

export type ServiceKeyAction = Pick<
  ActionMenuItemProps,
  'label' | 'color' | 'onClick' | 'isDisabled' | 'isLoading' | 'iamActions' | 'urn'
> & {
  icon: ICON_NAME;
  buttonId:
    | 'service-key-download_encryption_key'
    | 'service-key-deactivate_encryption_key'
    | 'service-key-reactivate_encryption_key'
    | 'service-key-delete_encryption_key';
};
