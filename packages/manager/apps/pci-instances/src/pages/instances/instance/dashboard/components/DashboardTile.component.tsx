import { FC, PropsWithChildren } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { TileBlock } from '@ovh-ux/manager-react-components';
import { LoadingCell } from '@/pages/instances/datagrid/components/cell/LoadingCell.component';

type TDashboardTileProps = PropsWithChildren<{
  isLoading: boolean;
  label?: string;
}>;

export const DashboardTileBlock: FC<TDashboardTileProps> = ({
  label,
  isLoading,
  children,
}) => (
  <TileBlock label={label}>
    <LoadingCell isLoading={isLoading}>{children}</LoadingCell>
  </TileBlock>
);

export const DashboardTileText: FC<TDashboardTileProps> = ({
  children,
  ...props
}) => (
  <DashboardTileBlock {...props}>
    <OsdsText
      size={ODS_TEXT_SIZE._400}
      level={ODS_TEXT_LEVEL.body}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      {children}
    </OsdsText>
  </DashboardTileBlock>
);
