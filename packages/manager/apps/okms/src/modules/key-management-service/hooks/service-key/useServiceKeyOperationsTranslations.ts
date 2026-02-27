import {
  OkmsServiceKeyOperationUsage,
  OkmsServiceKeyOperations,
} from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

export const useServiceKeyOperationsTranslations = () => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  const operationNamesMap: Record<OkmsServiceKeyOperations, string> = {
    encrypt: t('key_management_service_service-keys_dashboard_field_operations_encrypt'),
    decrypt: t('key_management_service_service-keys_dashboard_field_operations_decrypt'),
    sign: t('key_management_service_service-keys_dashboard_field_operations_sign'),
    verify: t('key_management_service_service-keys_dashboard_field_operations_verify'),
    wrapKey: t('key_management_service_service-keys_dashboard_field_operations_wrapKey'),
    unwrapKey: t('key_management_service_service-keys_dashboard_field_operations_unwrapKey'),
  };

  const usageNamesMap: Record<OkmsServiceKeyOperationUsage, string> = {
    encrypt_decrypt: `${t('key_management_service_service-keys_dashboard_field_operations_encrypt')} / ${t('key_management_service_service-keys_dashboard_field_operations_decrypt')}`,
    sign_verify: `${t('key_management_service_service-keys_dashboard_field_operations_sign')} / ${t('key_management_service_service-keys_dashboard_field_operations_verify')}`,
    wrapKey_unwrapKey: `${t('key_management_service_service-keys_dashboard_field_operations_wrapKey')} / ${t('key_management_service_service-keys_dashboard_field_operations_unwrapKey')}`,
  };

  const usageDescriptionsMap: Record<OkmsServiceKeyOperationUsage, string> = {
    encrypt_decrypt: t(
      'key_management_service_service-keys_create_crypto_field_usage_description_encrypt_decrypt',
    ),
    sign_verify: t(
      'key_management_service_service-keys_create_crypto_field_usage_description_sign_verify',
    ),
    wrapKey_unwrapKey: t(
      'key_management_service_service-keys_create_crypto_field_usage_description_wrapKey_unwrapKey',
    ),
  };

  return {
    operationNamesMap,
    usageNamesMap,
    usageDescriptionsMap,
  };
};
