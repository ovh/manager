import { useTranslation } from 'react-i18next';
import { OkmsServiceKeyOperations } from '@/types/okmsServiceKey.type';

export const useServiceKeyOperationsTranslations = (
  operations: OkmsServiceKeyOperations[] | string[],
) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  const {
    encrypt,
    decrypt,
    sign,
    verify,
    wrapKey,
    unwrapKey,
  } = OkmsServiceKeyOperations;

  const translatedOperations = operations.map((operation) => {
    switch (operation) {
      case encrypt:
        return t(
          'key_management_service_service-keys_dashboard_field_operations_encrypt',
        );

      case decrypt:
        return t(
          'key_management_service_service-keys_dashboard_field_operations_decrypt',
        );

      case sign:
        return t(
          'key_management_service_service-keys_dashboard_field_operations_sign',
        );

      case verify:
        return t(
          'key_management_service_service-keys_dashboard_field_operations_verify',
        );

      case wrapKey:
        return t(
          'key_management_service_service-keys_dashboard_field_operations_wrapKey',
        );

      case unwrapKey:
        return t(
          'key_management_service_service-keys_dashboard_field_operations_unwrapKey',
        );

      default:
        return operation;
    }
  });

  return translatedOperations;
};
