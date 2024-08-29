import { describe, expect, it, test } from 'vitest';
import { OkmsServiceKeyOperations } from '@/types/okmsServiceKey.type';
import { useServiceKeyOperationsTranslations } from './useServiceKeyOperationsTranslations';

describe('get service key operations translation ', () => {
  const useCases: {
    operation: OkmsServiceKeyOperations;
    translationKey: string;
  }[] = [
    {
      operation: OkmsServiceKeyOperations.sign,
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_sign',
    },
    {
      operation: OkmsServiceKeyOperations.verify,
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_verify',
    },
    {
      operation: OkmsServiceKeyOperations.encrypt,
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_encrypt',
    },
    {
      operation: OkmsServiceKeyOperations.decrypt,
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_decrypt',
    },
    {
      operation: OkmsServiceKeyOperations.wrapKey,
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_wrapKey',
    },
    {
      operation: OkmsServiceKeyOperations.unwrapKey,
      translationKey:
        'key_management_service_service-keys_dashboard_field_operations_unwrapKey',
    },
  ];

  test.each(useCases)(
    'should return the right translation keys for $operation',
    ({ operation, translationKey }) => {
      // given operation and translationKey

      // when
      const result = useServiceKeyOperationsTranslations([operation]);

      // then
      expect(result).toStrictEqual([translationKey]);
    },
  );

  it('should return operation as string if unexpected value', () => {
    // given
    const operations = ['aaa', 'bbb', 'ccc', 'ddd'];

    // when
    const result = useServiceKeyOperationsTranslations(operations);

    // then
    expect(result).toStrictEqual(operations);
  });
});
