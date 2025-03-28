import { FC } from 'react';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { LoadingCell } from '@/components/datagrid/cell/LoadingCell.component';
import { BaseTextCell } from '@/components/datagrid/cell/TextCell.component';
import { DeepReadonly } from '@/types/utils.type';

export type TListCellItem = DeepReadonly<{
  id: string;
  name: string;
  href?: string;
}>;

export type TListCellProps = DeepReadonly<{
  isLoading: boolean;
  items: TListCellItem[];
}>;
export const ListCell: FC<TListCellProps> = ({ isLoading, items }) => (
  <LoadingCell isLoading={isLoading}>
    {items.map((item) =>
      item.href ? (
        <OsdsLink
          color={ODS_THEME_COLOR_INTENT.primary}
          className={'block'}
          href={item.href}
          key={item.id}
        >
          {item.name}
        </OsdsLink>
      ) : (
        <BaseTextCell key={item.id}>{item.name}</BaseTextCell>
      ),
    )}
  </LoadingCell>
);
