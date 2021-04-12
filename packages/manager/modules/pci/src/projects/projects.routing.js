import map from 'lodash/map';
import { Environment } from '@ovh-ux/manager-config';
import { SupportLevel } from '@ovh-ux/manager-models';

import Project from './Project.class';
import Offer from '../components/project/offer/offer.class';

import { GUIDES_URL } from '../components/project/guides-header/guides-header.constants';

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

      getProject: /* @ngInject */ (OvhApiCloudProject) => (project) =>
        OvhApiCloudProject.v6()
          .get({ serviceName: project.serviceName })
          .$promise.then((projectDetails) => new Project(projectDetails)),

      goToProject: /* @ngInject */ ($state) => (project) =>
        $state.go('pci.projects.project', { projectId: project.serviceName }),

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

      guideUrl: () => GUIDES_URL,

      isHdsAvailable: /* @ngInject */ (ovhFeatureFlipping) => {
        const hdsId = 'public-cloud:hds';
        return ovhFeatureFlipping
          .checkFeatureAvailability(hdsId)
          .then((hdsFeature) => hdsFeature.isFeatureAvailable(hdsId));
      },

      isValidHdsSupportLevel: () => {
        const { supportLevel } = Environment.getUser();
        const sl = new SupportLevel(supportLevel);
        return sl.isEnterprise() || sl.isBusiness();
      },

      projects: /* @ngInject */ (OvhApiCloudProject) =>
        OvhApiCloudProject.v6()
          .query()
          .$promise.then((projects) =>
            map(projects, (serviceName) => new Project({ serviceName })),
          ),

      terminateProject: /* @ngInject */ (OvhApiCloudProject) => (project) =>
        OvhApiCloudProject.v6().delete({ serviceName: project.serviceName })
          .$promise,
    },
  });
};
