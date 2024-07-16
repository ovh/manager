import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

export function DowHelper() {
  const { t } = useTranslation('workflow-add');
  return (
    <OsdsPopover>
      <span slot="popover-trigger">
        <OsdsIcon
          name={ODS_ICON_NAME.HELP}
          size={ODS_ICON_SIZE.xxs}
          className="ml-2"
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={(event) => event.stopPropagation()}
        />
      </span>
      <OsdsPopoverContent>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
        >
          <ul>
            <li>{t('pci_workflow_create_cron_dow_helper_1')}</li>
            <li>{t('pci_workflow_create_cron_dow_helper_2')}</li>
          </ul>
        </OsdsText>
      </OsdsPopoverContent>
    </OsdsPopover>
  );
}
