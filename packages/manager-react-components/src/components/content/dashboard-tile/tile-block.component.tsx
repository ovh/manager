import React from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

export type TileBlockProps = React.PropsWithChildren<{
  label?: React.ReactNode;
}>;

export const TileBlock: React.FC<React.PropsWithChildren<TileBlockProps>> = ({
  label,
  children,
}) => (
  <div className="flex flex-col gap-1">
    <OdsText preset={ODS_TEXT_PRESET.heading6}>{label}</OdsText>
    {children}
  </div>
);
