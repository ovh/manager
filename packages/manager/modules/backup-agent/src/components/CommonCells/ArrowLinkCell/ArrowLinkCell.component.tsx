import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsLink } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

export const ArrowLinkCell = ({
  className = '',
  ...params
}: React.ComponentProps<typeof OdsLink>) => {
  return (
    <DataGridTextCell>
      <OdsLink
        className={`[&::part(link)]:hover:!bg-none [&::part(link)]:!transition-none ${className}`}
        label=""
        icon={ODS_ICON_NAME.arrowRight}
        {...params}
      />
    </DataGridTextCell>
  );
};
