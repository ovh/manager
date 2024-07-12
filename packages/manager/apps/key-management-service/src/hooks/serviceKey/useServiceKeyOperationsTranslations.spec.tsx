import { describe, expect, it, test } from 'vitest';
import { OkmsServiceKeyOperations } from '@/types/okmsServiceKey.type';
import { useServiceKeyOperationsTranslations } from './useServiceKeyOperationsTranslations';

describe('get service key operations translation ', () => {
  const useCases: {
    operations: OkmsServiceKeyOperations[];
    translationKey: string;
  }[] = [
    {
      operations: [
        OkmsServiceKeyOperations.sign,
        OkmsServiceKeyOperations.verify,
      ],
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_sign_verify',
    },
    {
      operations: [
        OkmsServiceKeyOperations.verify,
        OkmsServiceKeyOperations.sign,
      ],
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_sign_verify',
    },
    {
      operations: [
        OkmsServiceKeyOperations.wrapKey,
        OkmsServiceKeyOperations.unwrapKey,
      ],
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_wrap_unwrap',
    },
    {
      operations: [
        OkmsServiceKeyOperations.unwrapKey,
        OkmsServiceKeyOperations.wrapKey,
      ],
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_wrap_unwrap',
    },
    {
      operations: [
        OkmsServiceKeyOperations.encrypt,
        OkmsServiceKeyOperations.decrypt,
      ],
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_encrypt_decrypt',
    },
    {
      operations: [
        OkmsServiceKeyOperations.decrypt,
        OkmsServiceKeyOperations.encrypt,
      ],
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
