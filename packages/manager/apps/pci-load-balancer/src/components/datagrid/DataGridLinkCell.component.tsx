import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { FC, PropsWithChildren } from 'react';
import { useHref } from 'react-router-dom';

const DataGridLinkCell: FC<PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => {
  const link = useHref(href);

  return (
    <DataGridTextCell>
      <OsdsLink color={ODS_THEME_COLOR_INTENT.primary} href={link}>
        {children}
      </OsdsLink>
    </DataGridTextCell>
  );
};

export default DataGridLinkCell;
