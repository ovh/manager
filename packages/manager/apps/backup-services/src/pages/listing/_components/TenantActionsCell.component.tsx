import { OdsButton } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

export const TenantActionCell = () => {
  return (
    <DataGridTextCell>
      <OdsButton label="" icon="trash" variant="ghost" isDisabled />
    </DataGridTextCell>
  );
};
