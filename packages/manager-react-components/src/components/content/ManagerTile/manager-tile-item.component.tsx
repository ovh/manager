import React from 'react';

export type TileBlockProps = React.PropsWithChildren<{
  label?: string;
}>;

export const ManagerTileItem = ({ children }: React.PropsWithChildren) => {
  return <dl className="flex flex-col gap-y-[8px] my-0">{children}</dl>;
};

const ManagerTileItemLabel = ({ children }: React.PropsWithChildren) => {
  return (
    <dt className="tile-block-title m-0 text-[--ods-color-heading] text-[16px] leading-[16px] font-semibold">
      {children}
    </dt>
  );
};

const ManagerTileItemDescription = ({ children }: React.PropsWithChildren) => {
  return (
    <dt className="tile-block-title m-0 text-[--ods-color-heading] text-[16px] leading-[16px] font-semibold">
      {children}
    </dt>
  );
};

ManagerTileItem.Label = ManagerTileItemLabel;
ManagerTileItem.Description = ManagerTileItemDescription;
