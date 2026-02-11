import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Button,
  ICON_NAME,
  Icon,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

export default function GrafanaButton() {
  const { t } = useTranslation(['tenants', 'shared']);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={BUTTON_VARIANT.outline} disabled={true}>
          {t('tenants:dashboard.explore_in_grafana_button')}
          <Icon name={ICON_NAME.externalLink} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{t('shared:coming_soon')}</TooltipContent>
    </Tooltip>
  );
}
