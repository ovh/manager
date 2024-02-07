import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OsdsButton } from '@ovhcloud/ods-components/react';

export default function Ellipsis() {
  return (
    <OsdsButton
      color={ODS_THEME_COLOR_INTENT.primary}
      disabled={true}
      inline
      variant={ODS_BUTTON_VARIANT.ghost}
      size={ODS_BUTTON_SIZE.sm}
    >
      &#8230;
    </OsdsButton>
  );
}
