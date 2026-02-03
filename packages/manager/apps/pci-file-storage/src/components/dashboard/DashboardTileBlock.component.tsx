import React, { FC, PropsWithChildren } from 'react';

import { Divider, Skeleton, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

export type TDashboardTileBlockProps = PropsWithChildren<{
  isLoading?: boolean;
  label?: string;
  withoutDivider?: boolean;
}>;

export const DashboardTileBlock: FC<TDashboardTileBlockProps> = ({
  label,
  isLoading = false,
  withoutDivider = false,
  children,
}) => (
  <dl className="m-0 flex flex-col gap-1">
    {!withoutDivider && <Divider spacing="6" className="w-full" />}
    <dt>
      {label != null && (
        <div className="flex items-center gap-2">
          <Text preset={TEXT_PRESET.heading6}>{label}</Text>
        </div>
      )}
    </dt>
    <dd className="m-0">{isLoading ? <Skeleton /> : children}</dd>
  </dl>
);
