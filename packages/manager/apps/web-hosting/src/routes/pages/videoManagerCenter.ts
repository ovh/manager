import React from 'react';

export const VideoManagerCenterPage = React.lazy(
  () => import('@/pages/videoManagerCenter/videoManagerCenter.page'),
);
export const VideoManagerDashboardPage = React.lazy(
  () => import('@/pages/videoManagerCenter/dashboard/videoManagerDashboard.page'),
);

export const VideoManagerOnboardingPage = React.lazy(
  () => import('@/pages/videoManagerCenter/onBoarding/videoManagerOnboarding.page'),
);
