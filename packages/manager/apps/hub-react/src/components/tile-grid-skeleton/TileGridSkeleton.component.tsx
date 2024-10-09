import React from 'react';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { ODS_SKELETON_SIZE } from '@ovhcloud/ods-components';
import TileSkeleton from '@/components/tile-grid-skeleton/tile-skeleton/TileSkeleton.component';

export default function TileGridSkeleton() {
  return (
    <>
      <OsdsSkeleton
        data-testid="tile_grid_title_skeleton"
        size={ODS_SKELETON_SIZE.md}
      />
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-3 mb-4"
        data-testid="tile_grid_content_skeletons"
      >
        <TileSkeleton />
        <TileSkeleton />
        <TileSkeleton />
      </div>
    </>
  );
}
