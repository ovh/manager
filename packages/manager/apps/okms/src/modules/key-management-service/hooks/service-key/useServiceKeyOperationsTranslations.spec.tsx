import { OkmsServiceKeyOperations } from '@key-management-service/types/okmsServiceKey.type';
import { describe, expect, test, vi } from 'vitest';

import { useServiceKeyOperationsTranslations } from './useServiceKeyOperationsTranslations';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

describe('get service key operations translation', () => {
  const useCases: {
    operation: OkmsServiceKeyOperations;
    translationKey: string;
  }[] = [
    {
      operation: 'sign',
      translationKey: 'key_management_service_service-keys_dashboard_field_operations_sign',
    },
    {
      operation: 'verify',
      translationKey: 'key_management_service_service-keys_dashboard_field_operations_verify',
    },
    {
      operation: 'encrypt',
      translationKey: 'key_management_service_service-keys_dashboard_field_operations_encrypt',
    },
    {
      operation: 'decrypt',
      translationKey: 'key_management_service_service-keys_dashboard_field_operations_decrypt',
    },
    {
      operation: 'wrapKey',
      translationKey: 'key_management_service_service-keys_dashboard_field_operations_wrapKey',
    },
    {
      operation: 'unwrapKey',
      translationKey: 'key_management_service_service-keys_dashboard_field_operations_unwrapKey',
    },
  ];

  test.each(useCases)(
    'should return the right translation keys for $operation',
    ({ operation, translationKey }) => {
      // given operation and translationKey

      // when
      const result = useServiceKeyOperationsTranslations().operationNamesMap[operation];

      // then
      expect(result).toBe(translationKey);
    },
  );
});
