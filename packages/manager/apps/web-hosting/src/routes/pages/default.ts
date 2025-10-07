import React from 'react';

export const DashboardLayout = React.lazy(() => import('@/pages/dashboard/layout'));
export const MultisitePage = React.lazy(() => import('@/pages/dashboard/multisite/Multisite.page'));
export const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));
export const RootPage = React.lazy(() => import('@/pages/layout'));
export const WebsitesPage = React.lazy(() => import('@/pages/websites/Websites.page'));
