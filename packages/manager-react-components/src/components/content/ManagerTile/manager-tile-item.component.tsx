import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';

export const ManagerTileItem = ({ children }: React.PropsWithChildren) => {
  return <dl className="flex flex-col gap-1 m-0">{children}</dl>;
};

const ManagerTileItemLabel = ({ children }: React.PropsWithChildren) => {
  return (
    <dt>
      <OdsText preset={ODS_TEXT_PRESET.heading6}>{children}</OdsText>
    </dt>
  );
};

const ManagerTileItemDescription = ({ children }: React.PropsWithChildren) => {
  return <dd className="m-0">{children}</dd>;
};

ManagerTileItem.Label = ManagerTileItemLabel;
ManagerTileItem.Description = ManagerTileItemDescription;
