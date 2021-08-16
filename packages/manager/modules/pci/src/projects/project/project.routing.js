import { GUIDES_URL } from '../../components/project/guides-header/guides-header.constants';
import { LEGACY_PLAN_CODES } from './project.constants';

const isLegacy = (planCode) => LEGACY_PLAN_CODES.includes(planCode);

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project', {
    url: '/{projectId:[0-9a-zA-Z]{32}}',
    views: {
      '@pci': 'pciProject',
    },
    redirectTo: (transition) => {
      const projectPromise = transition.injector().getAsync('project');
      return projectPromise.then((project) => {
        if (project.status === 'creating') {
          // for specifying options of redirectTo attribute
          // we need to return a TargetState which is accessible
          // through router.stateService.target of transition object
          return transition.router.stateService.target(
            'pci.projects.project.creating',
            transition.params(),
            {
              location: false,
            },
          );
        }

        return null;
      });
    },
    resolve: {
      goToProjectInactive: ($state, projectId) => (project) =>
        $state.go('pci.projects.project.inactive', {
          project,
          projectId,
        }),

      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,

      project: /* @ngInject */ (OvhApiCloudProject, projectId) =>
        OvhApiCloudProject.v6().get({
          serviceName: projectId,
        }).$promise,
      quotas: /* @ngInject */ (loadQuotas) => loadQuotas(),
      loadQuotas: /* @ngInject */ (PciProjectsService, projectId) => () =>
        PciProjectsService.getQuotas(projectId),
      serviceInfos: /* @ngInject */ ($http, projectId) =>
        $http
          .get(`/cloud/project/${projectId}/serviceInfos`)
          .then(({ data }) => data)
          .catch(() => ({})),
      service: /* @ngInject */ ($http, serviceInfos) =>
        $http
          .get(`/services/${serviceInfos.serviceId}`)
          .then(({ data }) => data)
          .catch(() => null),
      isLegacyProject: /* @ngInject */ (service) =>
        isLegacy(service?.billing?.plan?.code),

      breadcrumb: /* @ngInject */ (project) =>
        project.status !== 'creating' ? project.description : null,

      user: /* @ngInject */ (SessionService) => SessionService.getUser(),

      getQuotaUrl: /* @ngInject */ ($state) => () =>
        $state.href('pci.projects.project.quota'),

      guideUrl: /* @ngInject */ (user) =>
        GUIDES_URL[user.ovhSubsidiary] || GUIDES_URL.DEFAULT,

      onListParamChange: /* @ngInject */ ($state, $transition$) => () => {
        return $state.go(
          '.',
          {
            projectId: $transition$.params().projectId,
          },
          { inherit: false },
        );
      },

      getStateName: /* @ngInject */ ($state) => () => {
        return $state.current.name;
      },

      goToRegion: /* @ngInject */ ($state, projectId) => () => {
        return $state.go('pci.projects.project.regions', {
          projectId,
        });
      },
    },
  });
};
