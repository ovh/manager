import {
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_TEXT_SIZE,
  ODS_TEXT_LEVEL,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

const IAMColumnLabel = () => {
  const { t } = useTranslation();

  return (
    <span className="inline-flex">
      <OsdsText
        data-testid="registryIamColumnLabel"
        className="text-[--ods-color-primary-800] self-center"
        size={ODS_TEXT_SIZE._500}
      >
        {t('private_registry_iam_authentication_status')}
      </OsdsText>
      <div onClick={(event) => event.stopPropagation()}>
        <OsdsPopover className="whitespace-normal">
          <span slot="popover-trigger">
            <OsdsIcon
              name={ODS_ICON_NAME.HELP}
              size={ODS_ICON_SIZE.xs}
              className="ml-4 cursor-help"
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </span>
          <OsdsPopoverContent>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
            >
              {t('private_registry_iam_authentication_infos_tooltip')}
            </OsdsText>
          </OsdsPopoverContent>
        </OsdsPopover>
      </div>
    </span>
  );
};

export default IAMColumnLabel;
