import { OkmsServiceKeyProtectionLevel } from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

type TuseServiceKeyProtectionLevelTranslations = OkmsServiceKeyProtectionLevel | (string & {});

export const useServiceKeyProtectionLevelTranslations = (
  protectionLevel: TuseServiceKeyProtectionLevelTranslations,
) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  switch (protectionLevel) {
    case 'HSM':
      return t('key_management_service_service-keys_protection_level_HSM');
    case 'MANAGED_HSM':
      return t('key_management_service_service-keys_protection_level_MANAGED_HSM');
    case 'SOFTWARE':
      return t('key_management_service_service-keys_protection_level_SOFTWARE');

    default:
      return protectionLevel;
  }
};
