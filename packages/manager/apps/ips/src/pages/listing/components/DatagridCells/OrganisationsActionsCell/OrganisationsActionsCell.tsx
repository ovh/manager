import React from 'react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';

type OrganisationsCellProps = {
  org: string;
};

export const OrganisationsActionsCell = ({ org }: OrganisationsCellProps) => {
  const id = `actions-${org}`;

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
