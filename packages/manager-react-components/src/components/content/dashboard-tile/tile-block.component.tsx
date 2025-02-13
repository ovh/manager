import React from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

export type TileBlockProps = React.PropsWithChildren<{
  label?: string;
}>;

export const TileBlock: React.FC<React.PropsWithChildren<TileBlockProps>> = ({
  label,
  children,
}) => (
  <dl className="flex flex-col gap-1 m-0">
    <dt>
      {!!label && <OdsText preset={ODS_TEXT_PRESET.heading6}>{label}</OdsText>}
    </dt>
    <dd className="m-0">{children}</dd>
  </dl>
);
