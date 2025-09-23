import { FC, PropsWithChildren } from 'react';
import { Divider, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { LoadingCell } from '@/pages/instances/datagrid/components/cell/LoadingCell.component';

type TDashboardTileProps = PropsWithChildren<{
  isLoading?: boolean;
  label?: string;
  withoutDivider?: boolean;
}>;

export const DashboardTileBlock: FC<TDashboardTileProps> = ({
  label,
  isLoading = false,
  withoutDivider = false,
  children,
}) => (
  <dl className="flex flex-col gap-1 m-0">
    <dt>
      {label && (
        <div className="flex items-center gap-2">
          <Text preset={TEXT_PRESET.heading6}>{label}</Text>
        </div>
      )}
    </dt>
    <dd className="m-0">
      <LoadingCell isLoading={isLoading}>{children}</LoadingCell>
    </dd>
    {!withoutDivider && <Divider spacing="6" className="w-full" />}
  </dl>
);

export const DashboardTileText: FC<TDashboardTileProps> = ({
  children,
  ...props
}) => (
  <DashboardTileBlock {...props}>
    <Text>{children}</Text>
  </DashboardTileBlock>
);
