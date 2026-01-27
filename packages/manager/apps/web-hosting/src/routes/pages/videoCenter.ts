import React from 'react';

export const VideoCenterPage = React.lazy(() => import('@/pages/videoCenter/videoCenter.page'));
export const VideoCenterDashboardPage = React.lazy(
  () => import('@/pages/videoCenter/dashboard/videoCenterDashboard.page'),
);
export const FreemiumDashboardPage = React.lazy(
  () => import('@/pages/videoCenter/dashboard/freemiumDashboard.page'),
);
export const VideoCenterOnboardingPage = React.lazy(
  () => import('@/pages/videoCenter/onBoarding/videoCenterOnboarding.page'),
);
export const VideoCenterOrderPage = React.lazy(
  () => import('@/pages/videoCenter/offer/videoCenterOrder.page'),
);
export const VideoCenterActivatePage = React.lazy(
  () => import('@/pages/videoCenter/offer/VideoCenterActivate.page'),
);
