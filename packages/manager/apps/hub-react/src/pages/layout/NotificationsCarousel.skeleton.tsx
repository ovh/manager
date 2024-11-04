import { OsdsSkeleton, OsdsTile } from '@ovhcloud/ods-components/react';
import { ODS_SKELETON_SIZE } from '@ovhcloud/ods-components';
import React from 'react';

export default function NotificationsCarouselSkeleton() {
  return (
    <>
      <OsdsTile className="p-5">
        <OsdsSkeleton inline size={ODS_SKELETON_SIZE.sm} />
        <OsdsSkeleton />
      </OsdsTile>
    </>
  );
}
