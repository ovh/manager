import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import React from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constant';
import { wizardPageName } from '@/tracking.constants';

const LayoutPage = React.lazy(() => import('@/pages/layout'));
const DashboardPage = React.lazy(() => import('@/pages/dashboard'));
const GeneralInformationsPage = React.lazy(() =>
  import('@/pages/dashboard/general-informations'),
);
const InstallationHistoryPage = React.lazy(() =>
  import('@/pages/listing/InstallationHistory.page'),
);
const InstallationDetailsPage = React.lazy(() =>
  import('@/pages/dashboard/installationDetails/InstallationDetails.page'),
);
const DeleteInstallationPage = React.lazy(() =>
  import('@/pages/dashboard/deleteInstallation/DeleteInstallation.page'),
);
const OnboardingPage = React.lazy(() => import('@/pages/onboarding'));
const InstallationDashboardPage = React.lazy(() =>
  import('@/pages/installation/InstallationDashboard.page'),
);
const WizardPage = React.lazy(() =>
  import('@/pages/installation/wizardStep/InstallationWizard.page'),
);
const InitialStepPage = React.lazy(() =>
  import('@/pages/installation/initialStep/InstallationInitialStep.page'),
);
const StepIdPage = React.lazy(() =>
  import('@/pages/installation/formStep/FormStep.page'),
);

export default (
  <Route
    path={urls.root}
    Component={LayoutPage}
    id={'root'}
    errorElement={
      <ErrorBoundary
        redirectionApp="sap-features-hub"
        isPreloaderHide={true}
        isRouteShellSync={true}
      />
    }
  >
    <Route path={urls.dashboard} Component={DashboardPage}>
      <Route
        id={'dashboard'}
        path={''}
        Component={GeneralInformationsPage}
        handle={{
          tracking: {
            pageName: '',
            pageType: PageType.dashboard,
          },
        }}
      />
    </Route>
    <Route
      id={'listing'}
      path={urls.listing}
      Component={InstallationHistoryPage}
      handle={{
        tracking: {
          pageName: 'history',
          pageType: PageType.listing,
        },
      }}
    >
      <Route
        id={'dashboard.deleteInstallation'}
        path={urls.deleteInstallation}
        Component={DeleteInstallationPage}
        handle={{
          tracking: {
            pageName: 'delete-installation',
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
    <Route
      id={'dashboard.installationDashboard'}
      path={urls.installationReport}
      Component={InstallationDetailsPage}
      handle={{
        tracking: {
          pageName: 'history-detail',
          pageType: PageType.dashboard,
        },
      }}
    />
    <Route
      id={'onboarding'}
      path={urls.onboarding}
      Component={OnboardingPage}
      handle={{
        tracking: {
          pageName: 'onboarding',
          pageType: PageType.onboarding,
        },
      }}
    />
    <Route path={urls.installationWizard} Component={InstallationDashboardPage}>
      <Route
        id={'wizard'}
        path={''}
        Component={WizardPage}
        handle={{
          tracking: {
            pageName: wizardPageName,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={'initialStep'}
        path={urls.installationInitialStep}
        Component={InitialStepPage}
        handle={{
          tracking: {
            pageName: wizardPageName,
            pageType: PageType.funnel,
          },
        }}
      />
      <Route
        id={'stepId'}
        path={urls.installationStep}
        Component={StepIdPage}
        handle={{
          tracking: {
            pageName: wizardPageName,
            pageType: PageType.funnel,
          },
        }}
      />
    </Route>
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
