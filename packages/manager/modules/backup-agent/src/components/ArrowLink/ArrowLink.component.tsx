import { ComponentProps, FC } from 'react';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsLink } from '@ovhcloud/ods-components/react';

type ArrowLinkType = ComponentProps<typeof OdsLink> & {
  fullClassName?: string;
};

export const ArrowLink: FC<ArrowLinkType> = ({ className = '', fullClassName, ...params }) => (
  <OdsLink
    className={
      fullClassName ||
      `[&::part(link)]:hover:!bg-none [&::part(link)]:!transition-none ${className}`
    }
    icon={ODS_ICON_NAME.arrowRight}
    {...params}
  />
);
