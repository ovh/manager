import flattenDeep from 'lodash/flattenDeep';
import controller from './hosting.controller';
import template from './hosting.html';

import { LOCAL_SEO_FAMILY } from '../local-seo/local-seo.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard', {
    url: '/:productId',
    template,
    controller,
    controllerAs: '$ctrl',
    reloadOnSearch: false,
    redirectTo: 'app.hosting.dashboard.information',
    resolve: {
      generalInformationLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.hosting.dashboard.information', $transition$.params()),
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
      websiteCoachLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'app.hosting.dashboard.website-coach',
          $transition$.params(),
        ),
      emailLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.email.domain', {
          ...$transition$.params(),
          tab: 'MAILING_LIST',
        }),
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
        ovhManagerProductOffersDetachService,
      ) =>
        $q.all(
          emailOptionServiceInfos.map(({ serviceId }) =>
            ovhManagerProductOffersDetachService
              .getAvailableDetachPlancodes(serviceId)
              .catch(() => [])
              .then((plancodes) => ({
                serviceId,
                detachPlancodes: plancodes,
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
        ovhManagerProductOffersDetachService,
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
                ovhManagerProductOffersDetachService
                  .getAvailableDetachPlancodes(serviceId)
                  .catch(() => [])
                  .then((plancodes) => ({
                    optionId: domain,
                    serviceId,
                    detachPlancodes: plancodes,
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
      goToHosting: /* @ngInject */ ($state, $timeout, Alerter) => (
        message = false,
        type = 'success',
        target = 'app.alerts.main',
      ) => {
        const promise = $state.go('app.hosting.dashboard', {});

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
    },
    translations: { value: ['.'], format: 'json' },
    atInternet: { ignore: true },
  });

  $stateProvider.state('app.hosting.dashboard.upgrade', {
    url: '/change-offer',
    templateUrl: 'hosting/offer/upgrade/hosting-offer-upgrade.html',
    controller: 'HostingUpgradeOfferCtrl',
    reloadOnSearch: false,
    translations: ['.'],
  });
};
