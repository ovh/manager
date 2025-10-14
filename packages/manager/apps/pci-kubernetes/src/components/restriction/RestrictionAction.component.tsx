import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';

type TRestrictionAction = {
  iconName: ODS_ICON_NAME;
  onClick: () => void;
  disabled: boolean;
  testId?: string;
};

export default function RestrictionAction({
  iconName,
  onClick,
  disabled,
  testId,
}: Readonly<TRestrictionAction>) {
  return (
    <OsdsButton
      data-testid={testId}
      size={ODS_BUTTON_SIZE.sm}
      variant={ODS_BUTTON_VARIANT.stroked}
      color={ODS_THEME_COLOR_INTENT.primary}
      inline
      onClick={onClick}
      disabled={disabled || undefined}
    >
      <OsdsIcon name={iconName} size={ODS_ICON_SIZE.xs} color={ODS_THEME_COLOR_INTENT.primary} />
    </OsdsButton>
  );
}
