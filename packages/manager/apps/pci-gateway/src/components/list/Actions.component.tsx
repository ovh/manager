import {
  OsdsButton,
  OsdsIcon,
  OsdsMedium,
  OsdsMenu,
  OsdsMenuItem,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { PrivateNetworkButton } from '@/components/list/PrivateNetworkButton.component';

export default function Actions({ projectId }: { projectId: string }) {
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
        <PrivateNetworkButton projectId={projectId} />
      </OsdsMenuItem>
    </OsdsMenu>
  );
}
