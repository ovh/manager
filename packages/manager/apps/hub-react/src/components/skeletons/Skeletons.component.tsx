import React, { FunctionComponent } from 'react';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';

export const Skeletons: FunctionComponent = () => (
  <>
    <OsdsSkeleton inline randomized />
    <OsdsSkeleton inline randomized />
    <OsdsSkeleton inline randomized />
    <OsdsSkeleton inline randomized />
  </>
);
