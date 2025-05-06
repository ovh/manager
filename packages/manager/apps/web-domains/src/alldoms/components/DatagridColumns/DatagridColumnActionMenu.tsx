import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import React from 'react';

interface DatagridColumnActionMenuProps {
  readonly serviceId: string;
}

export default function DatagridColumnActionMenu({
  serviceId,
}: DatagridColumnActionMenuProps) {
  return (
    <ActionMenu
      id={serviceId}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      items={[]}
    />
  );
}
