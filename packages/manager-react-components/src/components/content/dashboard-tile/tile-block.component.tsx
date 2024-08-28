import React from 'react';

export type TileBlockProps = React.PropsWithChildren<{
  label?: string;
}>;

export const TileBlock: React.FC<React.PropsWithChildren<TileBlockProps>> = ({
  label,
  children,
}) => (
  <dl className="flex flex-col gap-y-[8px] my-0">
    <dt className="tile-block-title m-0 text-[--ods-color-heading] text-[16px] leading-[16px] font-semibold">
      {label}
    </dt>
    <dd className="tile-block-description m-0 text-[--ods-color-text] text-[16px] leading-[16px] min-h-[16px]">
      {children}
    </dd>
  </dl>
);
