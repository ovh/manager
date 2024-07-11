import { describe, expect, it, test } from 'vitest';
import { OkmsServiceKeyAllOperations } from '@/types/okmsServiceKey.type';
import { useServiceKeyOperationsTranslations } from './useServiceKeyOperationsTranslations';

describe('get service key operations translation ', () => {
  const useCases: {
    operations: OkmsServiceKeyAllOperations[];
    translationKey: string;
  }[] = [
    {
      operations: ['sign', 'verify'],
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_sign_verify',
    },
    {
      operations: ['verify', 'sign'],
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_sign_verify',
    },
    {
      operations: ['wrapKey', 'unwrapKey'],
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_wrap_unwrap',
    },
    {
      operations: ['unwrapKey', 'wrapKey'],
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_wrap_unwrap',
    },
    {
      operations: ['encrypt', 'decrypt'],
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_encrypt_decrypt',
    },
    {
      operations: ['decrypt', 'encrypt'],
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_encrypt_decrypt',
    },
  ];

  test.each(useCases)(
    'should return the right translation key for $operations',
    ({ operations, translationKey }) => {
      // given operations and translationKey

      // when
      const result = useServiceKeyOperationsTranslations(operations);

      // then
      expect(result).toBe(translationKey);
    },
  );

  it('should return operations as string if unexpected values', () => {
    // given
    const operations = ['aaa', 'bbb'];

    // when
    const result = useServiceKeyOperationsTranslations(operations);

    // then
    expect(result).toBe(operations.join(' / '));
  });
});
