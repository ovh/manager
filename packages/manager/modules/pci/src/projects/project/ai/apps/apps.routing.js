import App from './App.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai.apps', {
    url: '/apps',
    component: 'ovhManagerPciProjectApps',
    redirectTo: (transition) =>
      Promise.all([
        transition.injector().getAsync('apps'),
        transition.injector().getAsync('isAuthorized'),
      ]).then(([apps, isAuthorized]) =>
        apps.length === 0 || !isAuthorized
          ? { state: 'pci.projects.project.ai.apps.onboarding' }
          : false,
      ),
    resolve: {
      isAuthorized: /* @ngInject */ (AppService, projectId) =>
        AppService.isAuthorized(projectId),

      goToAddApp: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.ai.apps.add', { projectId }),

      apps: /* @ngInject */ (
        AppService,
        projectId,
        coreConfig,
        ovhManagerRegionService,
        isAuthorized,
      ) =>
        isAuthorized
          ? AppService.getApps(projectId).then((apps) =>
              apps.map(
                (app) =>
                  new App(
                    app,
                    coreConfig.getUser().ovhSubsidiary,
                    ovhManagerRegionService.getRegion(app.spec.region),
                  ),
              ),
            )
          : [],

      goToApps: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state = 'pci.projects.project.ai.apps';

        const promise = $state.go(
          state,
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => CucCloudMessage[type](message, state));
        }

        return promise;
      },

      goToApp: /* @ngInject */ ($state, CucCloudMessage, projectId) => (
        app,
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const stateName =
          'pci.projects.project.ai.apps.dashboard.general-information';

        const promise = $state.go(
          stateName,
          {
            projectId,
            appId: app.id,
          },
          {
            reload,
          },
        );
        return message
          ? promise.then(() => {
              CucCloudMessage.flushMessages(stateName);
              CucCloudMessage[type](message, stateName);
            })
          : promise;
      },

      goToStartApp: /* @ngInject */ ($state, projectId) => (app) =>
        $state.go('pci.projects.project.ai.apps.start', {
          projectId,
          app,
        }),

      goToStopApp: /* @ngInject */ ($state, projectId) => (app) =>
        $state.go('pci.projects.project.ai.apps.stop', {
          projectId,
          app,
        }),

      goToDeleteApp: /* @ngInject */ ($state, projectId) => (app) => {
        return $state.go('pci.projects.project.ai.apps.delete', {
          projectId,
          app,
        });
      },

      goToCreateToken: /* @ngInject */ ($state, projectId) => (app) => {
        return $state.go('pci.projects.project.ai.tokens.add', {
          projectId,
          labelSelector: `id=${app.id}`,
        });
      },

      goToAttachData: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.ai.apps.dashboard.attach-data', {
          projectId,
        }),

      reloadState: /* @ngInject */ ($state) => () => {
        $state.go($state.current, {}, { reload: true });
      },

      appLink: /* @ngInject */ ($state, projectId) => (app) =>
        $state.href('pci.projects.project.ai.apps.dashboard', {
          projectId,
          appId: app.id,
        }),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_ai_app_list_title'),

      messageContainer: () => 'pci.projects.project-ai.apps',

      pollAppStatus: /* @ngInject */ (AppService, apps, projectId) => () => {
        apps.forEach((app) => {
          if (app.isPending()) {
            AppService.pollAppStatus(projectId, app.id).then((appInfo) =>
              app.updateData(appInfo),
            );
          }
        });
      },

      stopPollingAppStatus: /* @ngInject */ (
        AppService,
        apps,
        projectId,
      ) => () =>
        apps.forEach((app) =>
          AppService.stopPollingAppStatus(projectId, app.id),
        ),

      appsTrackPrefix: () =>
        'PublicCloud::pci::projects::project::ai_machine_learning::apps',

      trackApps: /* @ngInject */ (appsTrackPrefix, trackClick, trackPage) => (
        complement,
        type = 'action',
        prefix = true,
      ) => {
        let name = complement;
        if (prefix) {
          name = `${appsTrackPrefix}::${complement}`;
        }

        switch (type) {
          case 'action':
          case 'navigation':
            trackClick(name, type);
            break;
          case 'page':
            trackPage(name);
            break;
          default:
            trackClick(name);
        }
      },

      trackClick: /* @ngInject */ (atInternet) => (hit, type = 'action') => {
        atInternet.trackClick({
          name: hit,
          type,
        });
      },

      trackPage: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackPage({
          name: hit,
        });
      },
    },
  });
};
