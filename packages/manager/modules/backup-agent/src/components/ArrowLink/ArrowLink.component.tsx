import { FC } from "react";

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsLink } from '@ovhcloud/ods-components/react';

type ArrowLinkType = React.ComponentProps<typeof OdsLink> & {
    fullClassName?: string
}

export const ArrowLink = ({
  className = '',
  fullClassName,
  ...params
}: ArrowLinkType)  => (
    <OdsLink
        className={fullClassName || `[&::part(link)]:hover:!bg-none [&::part(link)]:!transition-none ${className}`}
        icon={ODS_ICON_NAME.arrowRight}
        {...params}
    />
)