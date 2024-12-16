import { FC } from 'react';
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

type Action = {
  id: number;
  content: React.ReactNode;
};

const DatagridActions: FC<{ actions: Action[] }> = ({ actions }) => (
  <OsdsMenu>
    <OsdsButton
      slot="menu-title"
      color={ODS_THEME_COLOR_INTENT.primary}
      variant={ODS_BUTTON_VARIANT.ghost}
    >
      <OsdsIcon
        name={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_ICON_SIZE.xxs}
      />
    </OsdsButton>
    {actions.map(({ id, content }) => (
      <OsdsMenuItem key={id}>{content}</OsdsMenuItem>
    ))}
  </OsdsMenu>
);

export default DatagridActions;
