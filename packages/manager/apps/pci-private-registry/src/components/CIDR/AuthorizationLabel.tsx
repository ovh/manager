import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
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
    <OsdsPopover>
      <span slot="popover-trigger">
        <OsdsText
          className="mb-4"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_TEXT_COLOR_INTENT.text}
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
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
          >
            {t(
              'private_registry_cidr_help_authorized_component_jklfdskfdslhfksdkhfkdlshfkdlshfkldshfkldhkldhslkfhdlskhfkldshfklhsdfklhdslkfdsklfhkldshfkl',
            )}
          </OsdsText>
        </Trans>
      </OsdsPopoverContent>
    </OsdsPopover>
  );
};

export default AuthorizationLabel;
