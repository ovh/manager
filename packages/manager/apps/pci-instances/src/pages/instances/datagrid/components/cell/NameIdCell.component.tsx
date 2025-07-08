import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { FC } from 'react';
import { useHref } from 'react-router-dom';
import { BaseTextCell } from '@/pages/instances/datagrid/components/cell/TextCell.component';
import { LoadingCell } from '@/pages/instances/datagrid/components/cell/LoadingCell.component';
import { TAggregatedInstance } from '@/types/instance/entity.type';

type TNameIdCellProps = {
  instance: TAggregatedInstance;
  isLoading: boolean;
};

export const NameIdCell: FC<TNameIdCellProps> = ({ isLoading, instance }) => {
  const detailHref = useHref(`${instance.id}?region=${instance.region}`);

  return (
    <LoadingCell isLoading={isLoading}>
      <OsdsLink
        color={ODS_THEME_COLOR_INTENT.primary}
        className={'block'}
        href={detailHref}
      >
        {instance.name}
      </OsdsLink>
      <BaseTextCell>{instance.id}</BaseTextCell>
    </LoadingCell>
  );
};
