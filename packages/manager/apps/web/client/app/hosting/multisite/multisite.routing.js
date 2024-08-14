import template from './MULTISITE.html';
import { GIT_STATUS } from './hosting-multisite.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.multisite', {
    url: '/multisite',
    controller: 'HostingTabDomainsCtrl',
    template,
    resolve: {
      goBack: /* @ngInject */ ($state, setMessage) => (
        message,
        type = 'success',
        reload = false,
      ) => {
        const promise = $state.go('^', null, {
          reload,
        });

        if (message) {
          promise.then(() => setMessage(message, type));
        }

        return promise;
      },
      goToViewLastDeploy: /* @ngInject */ ($state) => (serviceName, domain) => {
        return $state.go(
          'app.hosting.dashboard.multisite.git-view-last-deployment',
          {
            serviceName,
            path: domain.path,
          },
        );
      },
      goToDeployWebSite: /* @ngInject */ ($state) => (serviceName, domain) => {
        return $state.go('app.hosting.dashboard.multisite.git-deployment', {
          serviceName,
          path: domain.path,
        });
      },
      goToRemoveRepository: /* @ngInject */ ($state) => (serviceName, path) => {
        return $state.go('app.hosting.dashboard.multisite.git-removal', {
          serviceName,
          path,
        });
      },
      goToAssociateRepository: /* @ngInject */ (
        $state,
        $translate,
        setMessage,
      ) => (serviceName, domain) => {
        const promise = $state.go(
          'app.hosting.dashboard.multisite.git-association',
          {
            serviceName,
            path: domain.path,
          },
        );

        if (domain.vcsStatus === GIT_STATUS.initialError) {
          promise.then(() =>
            setMessage(
              $translate.instant(
                'hosting_multisite_git_association_apply_configuration_status_error',
              ),
              'danger',
              'git_association_alert',
            ),
          );
        }

        return promise;
      },
      goToConfigureGit: /* @ngInject */ ($state) => (serviceName, domain) =>
        $state.go('app.hosting.dashboard.multisite.git-configuration', {
          serviceName,
          path: domain.path,
        }),
      setMessage: /* @ngInject */ (Alerter, $timeout) => (
        message,
        type,
        alertId = 'app.alerts.tabs',
      ) => $timeout(() => Alerter.set(`alert-${type}`, message, null, alertId)),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_multisite'),
    },
  });
};
