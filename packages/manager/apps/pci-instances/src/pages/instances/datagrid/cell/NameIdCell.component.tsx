import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { FC } from 'react';
import { useHref } from 'react-router-dom';
import { BaseTextCell } from '@/components/datagrid/cell/TextCell.component';
import { LoadingCell } from '@/components/datagrid/cell/LoadingCell.component';
import { TInstance } from '@/types/instance/entity.type';

type TNameIdCellProps = {
  instance: TInstance;
  isLoading: boolean;
};

export const NameIdCell: FC<TNameIdCellProps> = ({ isLoading, instance }) => {
  const detailHref = useHref(
    `region/${instance.region}/instance/${instance.id}`,
  );

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
