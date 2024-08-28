import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import './dashboard-tile.scss';

export type TileBlockProps = {
  label: string;
};

export const TileBlock: React.FC<React.PropsWithChildren<TileBlockProps>> = ({
  label,
  children,
}) => (
  <div className="flex flex-col">
    <OdsText className="tile-block-title">
      <b>{label}</b>
    </OdsText>
    <OdsText className="tile-block-description">{children}</OdsText>
  </div>
);
