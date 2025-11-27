import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT, Button, ICON_NAME, Icon } from '@ovhcloud/ods-react';

export default function GrafanaButton() {
  const { t } = useTranslation('tenants');

  return (
    <Button variant={BUTTON_VARIANT.outline}>
      {t('dashboard.explore_in_grafana_button')}
      <Icon name={ICON_NAME.externalLink} />
    </Button>
  );
}
