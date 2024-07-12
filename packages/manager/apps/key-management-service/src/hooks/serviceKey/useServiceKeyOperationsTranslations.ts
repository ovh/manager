import { useTranslation } from 'react-i18next';
import { OkmsServiceKeyOperations } from '@/types/okmsServiceKey.type';

export const useServiceKeyOperationsTranslations = (
  operations: OkmsServiceKeyOperations[] | string[],
) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  const { encrypt, sign, wrapKey } = OkmsServiceKeyOperations;

  if (operations.includes(sign)) {
    return t(
      'key_management_service_service-keys_dashboard_field_operations_sign_verify',
    );
  }

  if (operations.includes(encrypt)) {
    return t(
      'key_management_service_service-keys_dashboard_field_operations_encrypt_decrypt',
    );
  }

  if (operations.includes(wrapKey)) {
    return t(
      'key_management_service_service-keys_dashboard_field_operations_wrap_unwrap',
    );
  }

  return operations.join(' / ');
};
