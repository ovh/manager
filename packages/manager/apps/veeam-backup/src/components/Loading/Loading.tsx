import React from 'react';
import {
  OsdsChip,
  OsdsSpinner,
  OsdsSkeleton,
} from '@ovhcloud/ods-components/react';
import { ODS_SKELETON_SIZE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

export const Loading = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={`flex justify-center ${props.className}`}>
    <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
  </div>
);

export const LoadingChip = ({ className }: { className?: string }) => (
  <OsdsChip className={className} inline color={ODS_THEME_COLOR_INTENT.default}>
    <OsdsSkeleton inline size={ODS_SKELETON_SIZE.xs} />
  </OsdsChip>
);
