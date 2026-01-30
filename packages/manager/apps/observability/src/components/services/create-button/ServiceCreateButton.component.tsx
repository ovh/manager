import { useTranslation } from 'react-i18next';

import { BUTTON_SIZE, BUTTON_VARIANT, Button } from '@ovhcloud/ods-react';

import { useObservabilityServiceOrderLink } from '@/hooks/useObservabilityServiceOrderLink.hook';

export default function ServiceCreateButton() {
  const orderLink = useObservabilityServiceOrderLink();
  const { t } = useTranslation('services');
  return (
    <Button
      variant={BUTTON_VARIANT.outline}
      size={BUTTON_SIZE.sm}
      onClick={() => window.open(orderLink, '_blank', 'noopener,noreferrer')}
    >
      {t('services:dashboard.enable_service')}
    </Button>
  );
}
