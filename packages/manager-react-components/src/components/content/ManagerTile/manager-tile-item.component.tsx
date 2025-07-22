import React, { PropsWithChildren } from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { HelpIconWithTooltip } from './help-icon-with-tooltip';

export const ManagerTileItem = ({ children }: PropsWithChildren) => {
  return <dl className="flex flex-col gap-1 m-0">{children}</dl>;
};

type ManagerTileItemLabelProps = PropsWithChildren<{ tooltip?: string }>;

const ManagerTileItemLabel = ({
  children,
  tooltip,
}: ManagerTileItemLabelProps) => {
  return (
    <dt className="flex items-center gap-2">
      <OdsText preset={ODS_TEXT_PRESET.heading6}>{children}</OdsText>
      {tooltip && <HelpIconWithTooltip label={tooltip} />}
    </dt>
  );
};

const ManagerTileItemDescription = ({ children }: PropsWithChildren) => {
  return <dd className="m-0">{children}</dd>;
};

ManagerTileItem.Label = ManagerTileItemLabel;
ManagerTileItem.Description = ManagerTileItemDescription;
