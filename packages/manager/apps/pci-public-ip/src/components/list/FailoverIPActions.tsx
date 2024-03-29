import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsMenu,
  OsdsMenuItem,
} from '@ovhcloud/ods-components/react';
import { NetworkSecurityAction } from './NetworkSecurityAction';

export default function FailoverIPActions({
  projectId,
}: {
  projectId: string;
}) {
  return (
    <OsdsMenu>
      <OsdsButton
        slot={'menu-title'}
        circle
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
      >
        <OsdsIcon
          name={ODS_ICON_NAME.ELLIPSIS}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_ICON_SIZE.xxs}
        ></OsdsIcon>
      </OsdsButton>
      <OsdsMenuItem>
        <NetworkSecurityAction projectId={projectId} isFloatingIP={false} />
      </OsdsMenuItem>
    </OsdsMenu>
  );
}
