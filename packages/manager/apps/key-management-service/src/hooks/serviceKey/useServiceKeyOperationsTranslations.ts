import { useTranslation } from 'react-i18next';
import {
  OkmsServiceKeyAllOperations,
  OkmsServiceKeyOperationEncrypt,
  OkmsServiceKeyOperationSign,
  OkmsServiceKeyOperationWrap,
} from '@/types/okmsServiceKey.type';

export const useServiceKeyOperationsTranslations = (
  operations: OkmsServiceKeyAllOperations[] | string[],
) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  const sign: OkmsServiceKeyOperationSign = 'sign';
  const encrypt: OkmsServiceKeyOperationEncrypt = 'encrypt';
  const wrapKey: OkmsServiceKeyOperationWrap = 'wrapKey';

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
