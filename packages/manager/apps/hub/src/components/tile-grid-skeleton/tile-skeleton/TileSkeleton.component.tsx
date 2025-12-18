import React from 'react';

import { ODS_SKELETON_SIZE } from '@ovhcloud/ods-components';
import { OsdsSkeleton, OsdsTile } from '@ovhcloud/ods-components/react';

export default function TileSkeleton() {
  return (
    <OsdsTile className="p-0">
      <div className="ovh-manager-hub-tile flex w-full flex-col p-6">
        <div
          className="ovh-manager-hub-tile__header mb-2 flex justify-between gap-4"
          data-testid="tile_skeleton_header"
        >
          <OsdsSkeleton className="mb-8" inline size={ODS_SKELETON_SIZE.sm} />
          <OsdsSkeleton className="float-right mb-8" inline size={ODS_SKELETON_SIZE.xs} />
        </div>
        <div data-testid="tile_skeleton_content">
          <OsdsSkeleton inline randomized className="list-item list-none" />
          <OsdsSkeleton inline randomized className="list-item list-none" />
          <OsdsSkeleton inline randomized className="list-item list-none" />
          <OsdsSkeleton inline randomized className="list-item list-none" />
        </div>
      </div>
    </OsdsTile>
  );
}
