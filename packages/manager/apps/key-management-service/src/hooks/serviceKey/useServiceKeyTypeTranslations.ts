import { useTranslation } from 'react-i18next';
import { OkmsKeyTypes } from '@/types/okmsServiceKey.type';

// eslint-disable-next-line @typescript-eslint/ban-types
type TuseServiceKeyTypeTranslations = OkmsKeyTypes | (string & {});

export const useServiceKeyTypeTranslations = (
  type: TuseServiceKeyTypeTranslations,
) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  switch (type) {
    case 'EC':
      return t('key_management_service_service-keys_dashboard_field_type_EC');
      break;
    case 'RSA':
      return t('key_management_service_service-keys_dashboard_field_type_RSA');
      break;
    case 'oct':
      return t('key_management_service_service-keys_dashboard_field_type_oct');
      break;

    default:
      return type;
      break;
  }
};
