import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { FC } from 'react';
import { useHref } from 'react-router-dom';
import { BaseTextCell } from '@/components/datagrid/cell/TextCell.component';
import { LoadingCell } from '@/components/datagrid/cell/LoadingCell.component';
import { TInstance } from '@/data/hooks/instance/useInstances';

type TNameIdCellProps = {
  instance: TInstance;
  isLoading: boolean;
};

export const NameIdCell: FC<TNameIdCellProps> = ({ isLoading, instance }) => (
  <LoadingCell isLoading={isLoading}>
    <OsdsLink
      color={ODS_THEME_COLOR_INTENT.primary}
      className={'block'}
      href={useHref(instance.id)}
    >
      {instance.name}
    </OsdsLink>
    <BaseTextCell>{instance.id}</BaseTextCell>
  </LoadingCell>
);
