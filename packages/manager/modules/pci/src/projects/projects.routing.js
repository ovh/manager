import has from 'lodash/has';

import { SupportLevel } from '@ovh-ux/manager-models';

import { PCI_FEATURES, PCI_FEATURES_STATES } from './projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects', {
    url: '/projects?context&target',
    component: 'pciProjects',
    redirectTo: (transition) => {
      const injector = transition.injector();

      return injector
        .get('$q')
        .all([
          injector.getAsync('$transition$'),
          injector.getAsync('projects'),
          injector.getAsync('activeProjects'),
          injector.getAsync('isRedirectRequired'),
          injector.getAsync('getTargetedState'),
          injector.getAsync('onBoardingStateName'),
        ])
        .then(
          ([
            $transition$,
            projects,
            activeProjects,
            isRedirectRequired,
            getTargetedState,
            onBoardingStateName,
          ]) => {
            if (!projects.length) {
              return onBoardingStateName;
            }

            // Redirect customer to right page
            if (isRedirectRequired && activeProjects.length === 1) {
              const targetState = getTargetedState(activeProjects[0]);
              targetState.params = {
                ...targetState.params,
                ...$transition$.params(),
              };

              return targetState;
            }

            return true;
          },
        );
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null,

      confirmDeletion: /* @ngInject */ ($state) => (project) =>
        $state.go('pci.projects.remove', { projectId: project.project_id }),

      setPciProjectModeTrackingProperty: /* @ngInject */ (atInternet) =>
        atInternet.setPciProjectMode({
          isDiscoveryProject: false,
          projectId: '',
        }),

      defaultProject: /* @ngInject */ (PciProjectsService) =>
        PciProjectsService.getDefaultProject(),

      redirectContext: /* @ngInject */ ($transition$) =>
        $transition$.params().context,

      redirectTarget: /* @ngInject */ ($transition$) =>
        JSON.parse($transition$.params()?.target || '{}'),

      isRedirectRequired: /* @ngInject */ (redirectTarget) => {
        const { category, state } = redirectTarget;
        const isStateExist = has(PCI_FEATURES_STATES, `${category}.${state}`);

        return isStateExist;
      },

      getTargetedState: /* @ngInject */ (
        redirectTarget,
        pciFeatures,
        $injector,
      ) => (project) =>
        new Promise((resolve) => {
          const category = redirectTarget.category.toUpperCase();
          const state = redirectTarget.state.toUpperCase();

          if (
            category === 'DATABASES' &&
            ['operational', 'databases'].includes(
              redirectTarget.params?.type,
            ) &&
            pciFeatures.isFeatureAvailable(
              PCI_FEATURES.PRODUCTS.DATABASES_ANALYTICS,
            )
          ) {
            const ovhShell = $injector.get('ovhShell');
            ovhShell.navigation
              .getURL(
                'public-cloud',
                `#/pci/projects/${project.project_id}/databases-analytics/operational/services/new`,
              )
              .then((url) => {
                resolve({
                  url,
                  isUApp: true,
                  params: redirectTarget.steps,
                });
              });
          } else {
            resolve({
              state: PCI_FEATURES_STATES[category][state],
              params: {
                ...redirectTarget.params,
                projectId: project.project_id,
              },
              options: {
                inherit: true,
              },
            });
          }
        }),

      goToState: /* @ngInject */ ($state) => (targetedStatePromise) => {
        targetedStatePromise.then((targetedState) => {
          if (targetedState.isUApp) {
            const url = new URL(targetedState.url);
            Object.keys(targetedState.params).forEach((key) => {
              url.searchParams.append(key, targetedState.params[key]);
            });
            const state = [targetedState.url, url.searchParams].join('?');
            window.location = state;
            return state;
          }
          const { state, params, options } = targetedState;
          return $state.go(state, params, options);
        });
      },

      goToProject: /* @ngInject */ ($state) => (project) =>
        $state.go('pci.projects.project', { projectId: project.project_id }),

      goToNewProject: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.new'),

      goToProjects: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go('pci.projects', {
          reload,
        });

        if (message) {
          promise.then(() => CucCloudMessage[type](message, 'pci.projects'));
        }

        return promise;
      },

      isHdsAvailable: /* @ngInject */ (pciFeatures) => {
        return pciFeatures.isFeatureAvailable(PCI_FEATURES.OTHERS.HDS);
      },

      isValidHdsSupportLevel: /* @ngInject */ (coreConfig) => {
        const { supportLevel } = coreConfig.getUser();
        const sl = new SupportLevel(supportLevel);
        return sl.isEnterprise() || sl.isBusiness();
      },

      projects: /* @ngInject */ (PciProjectsService) =>
        PciProjectsService.getProjects().then((projects) =>
          projects
            .filter((project) => !project.isTerminated())
            .sort((project1, project2) => {
              const project1SuspendedOrDebt =
                project1.isSuspended() || project1.hasPendingDebt();
              const project2SuspendedOrDebt =
                project2.isSuspended() || project2.hasPendingDebt();
              if (project1SuspendedOrDebt === project2SuspendedOrDebt) {
                return 0;
              }
              return project1SuspendedOrDebt ? -1 : 1;
            }),
        ),

      activeProjects: /* @ngInject */ (projects) => {
        return (projects || []).filter(({ status }) => status === 'ok');
      },

      numProjects: /* @ngInject */ (projects) => projects.length,

      billingUrl: /* @ngInject */ (coreURLBuilder) =>
        coreURLBuilder.buildURL('dedicated', '#/billing/history'),

      terminateProject: /* @ngInject */ (OvhApiCloudProject) => (project) =>
        OvhApiCloudProject.v6().delete({ serviceName: project.serviceName })
          .$promise,

      /**
       * Use this to reach the right catalog
       * @param isTrustedZone {boolean} : true if customer is trusted, otherwise false
       * @returns {string}: catalog endpoint
       */
      catalogEndpoint: /* @ngInject */ (isTrustedZone) => {
        return `/order/catalog/${
          isTrustedZone ? 'private/trustedZoneCloud' : 'public/cloud'
        }`;
      },

      user: /* @ngInject */ (SessionService) => SessionService.getUser(),

      /**
       * Indicate if customer is trusted zone program
       * @param pciFeatures {OvhFeatureFlipping} : ovhFeatureFlipping instance
       * @returns {*|boolean}: true if customer is trusted, otherwise false
       */
      isTrustedZone: /* @ngInject */ (pciFeatures) => {
        return pciFeatures.isFeatureAvailable(PCI_FEATURES.OTHERS.TRUSTED_ZONE);
      },

      isGridscaleLocalzoneAvailable: /* @ngInject */ (pciFeatures) => {
        return pciFeatures.isFeatureAvailable(
          PCI_FEATURES.INSTANCE_FLAVORS_CATEGORY.GRIDSCALE_LOCALZONE,
        );
      },

      /**
       * This function can be used to know if feature is accessible or not
       * @param pciFeatures { ovhFeatureFlipping }: feature flipping instance
       * @param projects { Array }: projects instance list
       * @returns {(function(*=): (string|boolean))|*}: state where the redirection is going, or false which mean no redirection required
       */
      pciFeatureRedirect: /* @ngInject */ (
        pciFeatures,
        projects,
        onBoardingStateName,
      ) => (feature) => {
        if (pciFeatures.isFeatureAvailable(feature)) {
          return projects.length ? 'pci.projects' : onBoardingStateName;
        }

        return true;
      },

      /**
       * Use this to know if PCI feature is available
       * eg: pciFeatures.isFeatureAvailable('kubernetes') for a product
       * eg: pciFeatures.isFeatureAvailable('public-cloud:users') for a settings
       * for more info about feature list, take a look at projects.constant.js file
       */
      pciFeatures: /* @ngInject */ (ovhFeatureFlipping) => {
        const featuresKeys = Object.keys(PCI_FEATURES);
        const pciFeaturesList = featuresKeys.reduce(
          (features, featCategory) => {
            const categoryFeatures = Object.values(PCI_FEATURES[featCategory]);
            return features.concat(categoryFeatures);
          },
          [],
        );

        return ovhFeatureFlipping
          .checkFeatureAvailability(pciFeaturesList)
          .then((features) => features);
      },

      projectsTrackPrefix: () => 'PublicCloud::pci::projects',

      trackPage: /* @ngInject */ (atInternet, projectsTrackPrefix) => (
        complement,
      ) => {
        return atInternet.trackPage({
          name: `${projectsTrackPrefix}::${complement}`,
        });
      },

      sendTrack: /* @ngInject */ (projectsTrackPrefix, trackClick) => (
        complement,
      ) => {
        return trackClick(`${projectsTrackPrefix}::${complement}`);
      },

      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        return atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },

      trackProjectCreationError: /* @ngInject */ (atInternet, numProjects) => (
        step,
        errorMessage,
      ) => {
        if (!step) {
          return null;
        }
        return atInternet.trackPage({
          name: 'PublicCloud_project_creation_error_message',
          pciCreationStep: step,
          pciCreationErrorMessage: errorMessage,
          pciCreationNumProjects3: numProjects,
        });
      },

      // 2024-02-12 : At the time we introduce the discovery mode,
      // users who are eligible for the "credit" payment method
      // cannot upgrade a project from the discovery project plan code
      // to the full featured project plan code.
      // These users must use the classic project creation funnel.
      onBoardingStateName: /* @ngInject */ (OvhApiCloud) =>
        OvhApiCloud.v6()
          .getEligibility()
          .$promise.then(({ paymentMethodsAuthorized }) =>
            paymentMethodsAuthorized.includes('credit')
              ? 'pci.projects.new'
              : 'pci.projects.onboarding',
          )
          .catch(() => 'pci.projects.onboarding'),
    },
  });
};
