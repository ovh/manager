import { ActionMenuItemProps } from '@ovh-ux/muk';

export type ServiceKeyAction = Pick<
  ActionMenuItemProps,
  'label' | 'color' | 'onClick' | 'isDisabled' | 'isLoading' | 'iamActions' | 'urn'
> & {
  buttonId:
    | 'service-key-download_encryption_key_pem'
    | 'service-key-download_encryption_key_jwk'
    | 'service-key-deactivate_encryption_key'
    | 'service-key-reactivate_encryption_key'
    | 'service-key-delete_encryption_key';
};
