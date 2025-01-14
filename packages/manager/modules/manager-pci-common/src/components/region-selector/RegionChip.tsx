import { OdsBadge, OdsTag } from '@ovhcloud/ods-components/react';
import { JSX, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import React, { HTMLAttributes } from 'react';

export type RegionChipProps = Omit<JSX.OdsTag, 'label'> &
  HTMLAttributes<HTMLOdsTagElement> & {
    showTooltipIcon?: boolean;
    title: string;
    className?: string;
  };

export function RegionChip({
  showTooltipIcon,
  title,
  className,
  ...chipProps
}: RegionChipProps) {
  return showTooltipIcon ? (
    <OdsTag
      class={className}
      icon={ODS_ICON_NAME.question}
      label={title}
      {...chipProps}
    />
  ) : (
    <OdsBadge class={className} label={title} {...chipProps} />
  );
}
