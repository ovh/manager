import flattenDeep from 'lodash/flattenDeep';
import controller from './hosting.controller';
import template from './hosting.html';

import { LOCAL_SEO_FAMILY } from '../local-seo/local-seo.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard', {
    url: '/:productId?tab',
    template,
    controller,
    controllerAs: '$ctrl',
    reloadOnSearch: false,
    redirectTo: (transition) => {
      const params = { ...transition.params(), tab: null };
      const { tab } = transition.params();
      return tab
        ? {
            state: `app.hosting.dashboard.${tab
              .toLowerCase()
              .replace('_', '-')}`,
            params,
          }
        : {
            state: 'app.hosting.dashboard.general-informations',
            params,
          };
    },
    params: {
      tab: null,
    },
    resolve: {
      cdnProperties: /* @ngInject */ (HostingCdnSharedService, serviceName) =>
        HostingCdnSharedService.getCDNProperties(serviceName)
          .then(({ data }) => data)
          .catch(() => null),

      cdnRange: /* @ngInject */ ($transition$, cdnProperties) => {
        if (!cdnProperties) {
          return '';
        }

        const range =
          cdnProperties.type.split('cdn-')[1]?.replace('-', ' ') ||
          cdnProperties.type;
        return `${range.charAt(0).toUpperCase()}${range.slice(1)}`;
      },

      generalInformationLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'app.hosting.dashboard.general-informations',
          $transition$.params(),
        ),
      multisiteLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.multisite', $transition$.params()),
      moduleLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.module', $transition$.params()),
      localSEOLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.local-seo', $transition$.params()),
      ftpLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.ftp', $transition$.params()),
      databaseLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.database', $transition$.params()),
      taskLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.task', $transition$.params()),
      runtimesLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.runtimes', $transition$.params()),
      envvarsLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.envvars', $transition$.params()),
      automatedEmailsLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'app.hosting.dashboard.automated-emails',
          $transition$.params(),
        ),
      cronLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.cron', $transition$.params()),
      userLogsLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.user-logs', $transition$.params()),
      boostLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.boost', $transition$.params()),
      indyLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.indy', $transition$.params()),
      freedomLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.freedom', $transition$.params()),
      goToEmails: /* @ngInject */ ($state) => (email) => {
        return $state.go('app.email.domain.mailing-list', {
          productId: email.domain,
        });
      },

      flushCDNLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.cdn.flush', $transition$.params()),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),

      availableOptions: /* @ngInject */ (WucOrderCartService, serviceName) =>
        WucOrderCartService.getProductServiceOptions(
          'webHosting',
          serviceName,
        ).catch(() => []),
      emailOptionIds: /* @ngInject */ (hostingEmailService, serviceName) =>
        hostingEmailService.getEmailOptionList(serviceName),
      emailOptionDetachInformation: /* @ngInject */ (
        $q,
        emailOptionServiceInfos,
        ovhManagerProductOffersActionService,
      ) =>
        $q.all(
          emailOptionServiceInfos.map(({ serviceId }) =>
            ovhManagerProductOffersActionService
              .getAvailableDetachPlancodes(serviceId)
              .catch(() => [])
              .then((plancodes) => ({
                serviceId,
                plancodes,
              })),
          ),
        ),
      emailOptionServiceInfos: /* @ngInject */ (
        $q,
        emailOptionIds,
        hostingEmailService,
        isEmailDomainAvailable,
        OvhApiEmailDomain,
        serviceName,
      ) =>
        (isEmailDomainAvailable
          ? $q.all(
              emailOptionIds.map((emailOptionId) =>
                hostingEmailService
                  .getEmailOptionServiceInformation(serviceName, emailOptionId)
                  .then(({ resource }) =>
                    OvhApiEmailDomain.v6()
                      .serviceInfos({
                        serviceName: resource.name,
                      })
                      .$promise.catch(() => null),
                  )
                  .catch(() => null),
              ),
            )
          : $q.resolve([])
        ).then((servicesInformation) =>
          flattenDeep(
            servicesInformation.filter((information) => information !== null),
          ),
        ),
      pendingTasks: /* @ngInject */ (HostingTask, serviceName) =>
        HostingTask.getPending(serviceName).catch(() => []),
      privateDatabasesIds: /* @ngInject */ (HostingDatabase, serviceName) =>
        HostingDatabase.getPrivateDatabaseIds(serviceName).catch(() => []),
      privateDatabasesDetachable: /* @ngInject */ (
        $q,
        ovhManagerProductOffersActionService,
        PrivateDatabase,
        privateDatabasesIds,
      ) =>
        $q
          .all(
            privateDatabasesIds.map((id) =>
              PrivateDatabase.getServiceInfos(id).catch(() => null),
            ),
          )
          .then((privateDatabasesInformation) =>
            flattenDeep(
              privateDatabasesInformation.filter(
                (information) => information !== null,
              ),
            ),
          )
          .then((privateDatabasesInformation) =>
            $q.all(
              privateDatabasesInformation.map(({ domain, serviceId }) =>
                ovhManagerProductOffersActionService
                  .getAvailableDetachPlancodes(serviceId)
                  .catch(() => [])
                  .then((plancodes) => ({
                    optionId: domain,
                    serviceId,
                    plancodes,
                  })),
              ),
            ),
          ),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      logs: /* @ngInject */ (HostingStatistics, serviceName, userLogsToken) =>
        HostingStatistics.getLogs(serviceName).then((logs) => ({
          ...logs,
          statsUrl: userLogsToken
            ? `${logs.stats}?token=${userLogsToken}`
            : logs.stats,
          logsUrl: userLogsToken
            ? `${logs.logs}?token=${userLogsToken}`
            : logs.logs,
        })),
      userLogsToken: /* @ngInject */ (Hosting, serviceName) =>
        Hosting.getUserLogsToken(serviceName, {
          params: {
            remoteCheck: true,
            ttl: 3600,
          },
        }).catch(() => null),
      goToDetachEmail: /* @ngInject */ ($state) => () =>
        $state.go('app.hosting.dashboard.detachEmail'),
      goToDetachPrivateDB: /* @ngInject */ ($state) => () =>
        $state.go('app.hosting.dashboard.database.detachPrivate'),

      goToMultisite: /* @ngInject */ (goToState) => (
        message = false,
        type = 'success',
        target = 'app.alerts.main',
      ) => goToState('app.hosting.dashboard.multisite', message, type, target),

      goToHosting: /* @ngInject */ (goToState) => (
        message = false,
        type = 'success',
        target = 'app.alerts.main',
      ) => goToState('app.hosting.dashboard', message, type, target),

      goToState: /* @ngInject */ ($state, $timeout, Alerter) => (
        stateToGo,
        message,
        type,
        target,
      ) => {
        const promise = $state.go(stateToGo, {});

        if (message) {
          promise.then(() =>
            $timeout(() => Alerter.set(`alert-${type}`, message, null, target)),
          );
        }

        return promise;
      },

      navigationInformations: /* @ngInject */ (Navigator, $rootScope) => {
        // eslint-disable-next-line no-param-reassign
        $rootScope.currentSectionInformation = 'hosting';
        return Navigator.setNavigationInformation({
          leftMenuVisible: true,
          configurationSelected: true,
        });
      },
      isLocalSeoAvailable: /* @ngInject */ (availableOptions) =>
        availableOptions.find(({ family }) => family === LOCAL_SEO_FAMILY),

      hostingSsl: /* @ngInject */ ($http, serviceName) =>
        $http
          .get(`/hosting/web/${serviceName}/ssl`)
          .then(({ data }) => data)
          .catch(() => null),

      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
    translations: { value: ['.'], format: 'json' },
    atInternet: { ignore: true },
  });

  $stateProvider.state('app.hosting.dashboard.upgrade', {
    url: '/change-offer',
    templateUrl: 'hosting/offer/upgrade/hosting-offer-upgrade.html',
    controller: 'HostingUpgradeOfferCtrl',
    reloadOnSearch: false,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_order_upgrade_modal_header'),
    },
  });
};
