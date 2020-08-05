import head from 'lodash/head';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl', {
    url: '/xdsl/:serviceName',
    template: '<div ui-view></div>',
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      lines: /* @ngInject */ (OvhApiXdslLines, serviceName) =>
        OvhApiXdslLines.v6().query({
          xdslId: serviceName,
        }).$promise,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('lines')
        .then((lines) => ({
          state: 'telecom.packs.pack.xdsl.line',
          params: {
            ...transition.params(),
            number: head(lines),
          },
        })),
  });

  $stateProvider.state('telecom.packs.pack.xdsl.line', {
    url: '/xdsl/:serviceName/lines/:number',
    views: {
      '@telecom.packs': 'packXdsl',
      'xdslView@telecom.packs.pack.xdsl.line': 'packXdslAccess',
    },
    translations: {
      value: [
        '../common',
        '.',
        './access',
        './access/comfortExchange',
        './access/deconsolidation',
        './access/statistics',
        './access/ipv6',
        './access/portReset',
        './access/profil',
        './access/rateLimit',
        './access/ip/order',
        './orderFollowUp',
      ],
      format: 'json',
    },
    resolve: {
      $title($translate, $stateParams, OvhApiXdsl) {
        return OvhApiXdsl.v6()
          .get({
            xdslId: $stateParams.serviceName,
          })
          .$promise.then((data) =>
            $translate.instant(
              'xdsl_page_title',
              { name: data.description || $stateParams.serviceName },
              null,
              null,
              'escape',
            ),
          )
          .catch(() =>
            $translate('xdsl_page_title', { name: $stateParams.serviceName }),
          );
      },
      goBack: /* @ngInject */ ($state) => (backState) => {
        $state.go(backState);
      },
      lineLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('telecom.packs.pack.xdsl.line', $transition$.params()),
      modemLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.packs.pack.xdsl.line.modem',
          $transition$.params(),
        ),
      taskLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.packs.pack.xdsl.line.tasks',
          $transition$.params(),
        ),
      currentActiveLink: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$.params()),
      breadcrumb: () => null,
    },
  });
};
