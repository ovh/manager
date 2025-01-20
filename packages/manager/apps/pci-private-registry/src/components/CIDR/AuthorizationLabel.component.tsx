import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';

import {
  OsdsText,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation, Trans } from 'react-i18next';

const AuthorizationLabel = () => {
  const { t } = useTranslation(['ip-restrictions']);
  return (
    <div className="whitespace-normal inline">
      <OsdsPopover>
        <span slot="popover-trigger">
          <OsdsText
            size={ODS_TEXT_SIZE._500}
            hue={ODS_TEXT_COLOR_HUE._800}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_TEXT_COLOR_INTENT.primary}
          >
            {t('private_registry_cidr_authorization')}
          </OsdsText>

          <OsdsIcon
            name={ODS_ICON_NAME.HELP}
            size={ODS_ICON_SIZE.xs}
            className="ml-4 cursor-help"
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </span>

        <OsdsPopoverContent>
          <Trans ns="ip-restrictions">
            <div className="flex flex-col gap-2">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
              >
                {t('private_registry_cidr_help_authorized_component')}
              </OsdsText>

              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
              >
                {t('private_registry_cidr_help_authorized_component_part2')}
              </OsdsText>

              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
              >
                {t('private_registry_cidr_help_authorized_component_part3')}
              </OsdsText>
            </div>
          </Trans>
        </OsdsPopoverContent>
      </OsdsPopover>
    </div>
  );
};

export default AuthorizationLabel;
