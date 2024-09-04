import React, { FunctionComponent } from 'react';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';

export const TileSkeleton: FunctionComponent = () => (
  <>
    <OsdsSkeleton inline randomized />
    <OsdsSkeleton inline randomized />
    <OsdsSkeleton inline randomized />
    <OsdsSkeleton inline randomized />
  </>
);
