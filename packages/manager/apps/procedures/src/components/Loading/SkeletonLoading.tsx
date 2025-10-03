import React, { FunctionComponent } from 'react';

import { OsdsSkeleton } from '@ovhcloud/ods-components/react';

export const SkeletonLoading: FunctionComponent = () => {
  return (
    <div className="w-[100%] p-10">
      <OsdsSkeleton randomized></OsdsSkeleton>
      <OsdsSkeleton randomized></OsdsSkeleton>
      <OsdsSkeleton randomized></OsdsSkeleton>
      <OsdsSkeleton randomized></OsdsSkeleton>
      <OsdsSkeleton randomized></OsdsSkeleton>
      <OsdsSkeleton randomized></OsdsSkeleton>
      <OsdsSkeleton randomized></OsdsSkeleton>
    </div>
  );
};
