import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

import { useHref } from 'react-router-dom';

type TDeleteAction = {
  networkId: string;
  region: string;
};

export default function DeleteAction({
  networkId,
  region,
}: Readonly<TDeleteAction>) {
  const { t } = useTranslation();

  const hrefDelete = useHref(
    `./delete?networkId=${networkId}&region=${region}`,
  );

  return (
    <div className="min-w-16">
      <OsdsTooltip>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_THEME_COLOR_INTENT.primary}
          href={hrefDelete}
        >
          <OsdsIcon
            name={ODS_ICON_NAME.BIN}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </OsdsButton>
        <OsdsTooltipContent slot="tooltip-content">
          {t('pci_projects_project_network_private_delete')}
        </OsdsTooltipContent>
      </OsdsTooltip>
    </div>
  );
}
