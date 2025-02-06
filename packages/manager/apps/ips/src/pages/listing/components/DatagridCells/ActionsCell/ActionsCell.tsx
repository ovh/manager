import React from 'react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';

export type ActionsCellParams = {
  ip: string;
};

export const ActionsCell = ({ ip }: ActionsCellParams) => {
  const id = `actions-${ip.replace(/\/|\./g, '-')}`;

  const items: ActionMenuItem[] = [];

  return (
    <ActionMenu
      items={items}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      icon={ODS_ICON_NAME.ellipsisVertical}
      id={id}
    />
  );
};
