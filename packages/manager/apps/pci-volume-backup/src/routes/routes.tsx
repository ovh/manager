import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';
import { VOLUME_BACKUP_TRACKING } from '@/tracking.constant';

const LayoutPage = lazy(() => import('@/pages/layout'));
const ListingPage = lazy(() => import('@/pages/listing/Listing.page'));
const RestorePage = lazy(() => import('@/pages/restore/Restore.page'));
const DeletePage = lazy(() => import('@/pages/delete/Delete.page'));
const OnboardingPage = lazy(() => import('@/pages/onboarding'));
const CreateVolumePage = lazy(() =>
  import('@/pages/create-volume/CreateVolume.page'),
);
const CreateVolumeBackupPage = lazy(() => import('@/pages/create/Create.page'));
const DetachVolumePage = lazy(() => import('@/pages/detach/DetachVolume.page'));

export default (
  <Route
    path="/pci/projects/:projectId/storages/volume-backup"
    Component={LayoutPage}
    errorElement={
      <ErrorBoundary
        isPreloaderHide={true}
        isRouteShellSync={true}
        redirectionApp="volume-backup"
      />
    }
  >
    <Route path="" element={<Navigate to={urls.listing} replace />} />
    <Route
      path={urls.onboarding}
      Component={OnboardingPage}
      handle={{
        tracking: {
          pageType: PageType.onboarding,
        },
      }}
    />
    <Route
      path={urls.createVolumeBackup}
      Component={CreateVolumeBackupPage}
      handle={{
        tracking: {
          pageName: VOLUME_BACKUP_TRACKING.CREATE.PAGE_NAME,
          pageType: PageType.funnel,
        },
      }}
    >
      <Route
        path={urls.detachVolume}
        Component={DetachVolumePage}
        handle={{
          tracking: {
            pageName: VOLUME_BACKUP_TRACKING.DETACH_VOLUME.PAGE_NAME,
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
    <Route
      path={urls.listing}
      Component={ListingPage}
      handle={{
        tracking: {
          pageType: PageType.listing,
        },
      }}
    >
      <Route
        path={urls.restore}
        Component={RestorePage}
        handle={{
          tracking: {
            pageName: VOLUME_BACKUP_TRACKING.RESTORE_VOLUME.PAGE_NAME,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        path={urls.deleteBackup}
        Component={DeletePage}
        handle={{
          tracking: {
            pageName: VOLUME_BACKUP_TRACKING.DELETE_BACKUP.PAGE_NAME,
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
    <Route
      path={urls.createVolume}
      Component={CreateVolumePage}
      handle={{
        tracking: {
          pageName: VOLUME_BACKUP_TRACKING.CREATE_VOLUME.PAGE_NAME,
          pageType: PageType.funnel,
        },
      }}
    />
  </Route>
);
