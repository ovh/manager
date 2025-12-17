import { PageType } from '@ovh-ux/manager-react-shell-client';

import { TrackingTags } from '@/tracking.constant';

export const getRouteTracking = (labels: TrackingTags[], pageType: PageType) => {
  const pageName = labels.join('_');

  return {
    tracking: {
      pageName,
      pageType,
    },
  };
};
