import { SupportLevel } from '@ovh-ux/manager-models';

import Offer from '../components/project/offer/offer.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects', {
    url: '/projects',
    component: 'pciProjects',
    redirectTo: (transition) => {
      const projectsPromise = transition.injector().getAsync('projects');
      return projectsPromise.then((projects) => {
        if (!projects.length) {
          return 'pci.projects.onboarding';
        }

        return true;
      });
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null,

      confirmDeletion: /* @ngInject */ ($state) => (project) =>
        $state.go('pci.projects.remove', { projectId: project.project_id }),

      deals: /* @ngInject */ ($q, OvhApiCloud) =>
        OvhApiCloud.Aapi()
          .getDeals()
          .$promise.then((deals) => new Offer(deals))
          .catch(() => $q.when({ active: false })),

      defaultProject: /* @ngInject */ (PciProjectsService) =>
        PciProjectsService.getDefaultProject(),

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

      isHdsAvailable: /* @ngInject */ (ovhFeatureFlipping) => {
        const hdsId = 'public-cloud:hds';
        return ovhFeatureFlipping
          .checkFeatureAvailability(hdsId)
          .then((hdsFeature) => hdsFeature.isFeatureAvailable(hdsId));
      },

      isValidHdsSupportLevel: /* @ngInject */ (coreConfig) => {
        const { supportLevel } = coreConfig.getUser();
        const sl = new SupportLevel(supportLevel);
        return sl.isEnterprise() || sl.isBusiness();
      },

      projects: /* @ngInject */ (PciProjectsService) =>
        PciProjectsService.getProjects().then((projects) =>
          projects.sort((project1, project2) => {
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

      billingUrl: (coreURLBuilder) =>
        coreURLBuilder.buildURL('dedicated', '#/billing/history'),

      terminateProject: /* @ngInject */ (OvhApiCloudProject) => (project) =>
        OvhApiCloudProject.v6().delete({ serviceName: project.serviceName })
          .$promise,

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
    },
  });
};
