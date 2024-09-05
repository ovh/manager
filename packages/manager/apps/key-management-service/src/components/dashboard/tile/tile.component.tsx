import { OsdsTile } from '@ovhcloud/ods-components/react';
import React from 'react';
import { CommonTitle } from '@ovh-ux/manager-react-components';

export type TileProps = {
  title: string;
};

export const Tile: React.FC<React.PropsWithChildren & TileProps> = ({
  title,
  children,
}) => {
  return (
    <OsdsTile rounded inline className="flex flex-col w-full h-fit">
      <div className="flex flex-col gap-6 pb-4">
        <CommonTitle>{title}</CommonTitle>
        {children}
      </div>
    </OsdsTile>
  );
};
