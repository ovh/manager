import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';

export default function TenantsPage() {
  const { t } = useTranslation(['common', 'tenants']);  

  return (
    <OdsText preset='heading-2'>
      {t('tenants:listing.title')}
    </OdsText>
  );
}
