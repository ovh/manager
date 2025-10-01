import React from 'react';

import { ODS_SKELETON_SIZE } from '@ovhcloud/ods-components';
import { OsdsSkeleton, OsdsTile } from '@ovhcloud/ods-components/react';

export default function TileSkeleton() {
  return (
    <OsdsTile className="p-0">
      <div className="ovh-manager-hub-tile w-full flex flex-col p-6">
        <div
          className="flex mb-2 gap-4 justify-between ovh-manager-hub-tile__header"
          data-testid="tile_skeleton_header"
        >
          <OsdsSkeleton className="mb-8" inline size={ODS_SKELETON_SIZE.sm} />
          <OsdsSkeleton className="mb-8 float-right" inline size={ODS_SKELETON_SIZE.xs} />
        </div>
        <div data-testid="tile_skeleton_content">
          <OsdsSkeleton inline randomized className="list-none list-item" />
          <OsdsSkeleton inline randomized className="list-none list-item" />
          <OsdsSkeleton inline randomized className="list-none list-item" />
          <OsdsSkeleton inline randomized className="list-none list-item" />
        </div>
      </div>
    </OsdsTile>
  );
}
