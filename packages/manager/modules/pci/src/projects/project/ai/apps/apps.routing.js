import find from 'lodash/find';

import get from 'lodash/get';
import App from './App.class';
import { APP_STATUS } from './app.constants';

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
        const state = 'pci.projects.project.ai-apps';

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

      goToDeleteApp: /* @ngInject */ ($state, projectId) => (app) =>
        $state.go('pci.projects.project.ai.apps.delete', {
          projectId,
          app,
        }),

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

      startApp: /* @ngInject */ (
        $translate,
        projectId,
        apps,
        pollAppStatus,
        messageContainer,
        AppService,
        CucCloudMessage,
      ) => (appId) => {
        const app = find(apps, { id: appId });
        AppService.startApp(projectId, appId).then(
          () => {
            app.setState(APP_STATUS.STARTING);
            pollAppStatus();
          },
          (error) => {
            CucCloudMessage.error(
              $translate.instant('pci_ai_app_list_start_error', {
                appName: app.name,
                message: get(error, 'data.message'),
              }),
              messageContainer,
            );
          },
        );
      },

      stopApp: /* @ngInject */ (
        $translate,
        projectId,
        apps,
        pollAppStatus,
        messageContainer,
        AppService,
        CucCloudMessage,
      ) => (appId) => {
        const app = find(apps, { id: appId });
        AppService.stopApp(projectId, appId).then(
          () => {
            app.setState(APP_STATUS.STOPPING);
            pollAppStatus();
          },
          (error) => {
            CucCloudMessage.error(
              $translate.instant('pci_ai_app_list_stop_error', {
                appName: app.name,
                message: get(error, 'data.message'),
              }),
              messageContainer,
            );
          },
        );
      },

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
        const name = `${prefix ? `${appsTrackPrefix}::` : ''}${complement}`;
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
