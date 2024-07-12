import { describe, expect, it, test } from 'vitest';
import { OkmsKeyTypes } from '@/types/okmsServiceKey.type';
import { useServiceKeyTypeTranslations } from './useServiceKeyTypeTranslations';

describe('get service key type translation ', () => {
  const useCases: {
    type: OkmsKeyTypes;
    translationKey: string;
  }[] = [
    {
      type: OkmsKeyTypes.EC,
      translationKey:
        'key_management_service_service-keys_dashboard_field_type_EC',
    },
    {
      type: OkmsKeyTypes.RSA,
      translationKey:
        'key_management_service_service-keys_dashboard_field_type_RSA',
    },
    {
      type: OkmsKeyTypes.oct,
      translationKey:
        'key_management_service_service-keys_dashboard_field_type_oct',
    },
  ];

  test.each(useCases)(
    'should return the right translation key for $type',
    ({ type, translationKey }) => {
      // given type and translationKey

      // when
      const result = useServiceKeyTypeTranslations(type);

      // then
      expect(result).toBe(translationKey);
    },
  );

  it('should return type if unexpected value', () => {
    // given
    const type = 'aaa';

    // when
    const result = useServiceKeyTypeTranslations(type);

    // then
    expect(result).toBe(type);
  });
});
