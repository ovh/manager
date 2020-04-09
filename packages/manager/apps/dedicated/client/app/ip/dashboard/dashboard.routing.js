import has from 'lodash/has';
import isString from 'lodash/isString';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard', {
    url: '?serviceName',
    reloadOnSearch: false,
    params: {
      serviceName: {
        type: 'string',
      },
    },
    resolve: {
      goToAntihack: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.dashboard.antihack', params, transitionParams),
      goToAntispam: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.antispam', params, transitionParams),
      goToArp: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.dashboard.arp', params, transitionParams),
      goToBlockDelete: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.dashboard.block.delete', params, transitionParams),
      goToBlockDescriptionEdit: /* @ngInject */ ($state) => (
        params,
        transitionParams,
      ) =>
        $state.go(
          'app.ip.dashboard.block.description-edit',
          params,
          transitionParams,
        ),
      goToBlockMove: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.dashboard.block.move', params, transitionParams),
      goToDashboard: /* @ngInject */ ($state, Alerter) => (
        params = {},
        transitionParams,
      ) => {
        const promise = $state.go('app.ip.dashboard', params, transitionParams);

        const { message } = params;
        if (message) {
          // Alerter.alertFromSWS expects either data.message, data.messages or a String
          let typeToUse;

          if (isString(message.data)) {
            typeToUse = message.data;
          } else if (
            has(message.data, 'message') ||
            has(message.data, 'messages')
          ) {
            typeToUse = message.data;
          } else {
            typeToUse = message.data.type;
          }

          promise.then(() => {
            Alerter.alertFromSWS(
              message.text,
              typeToUse,
              message.id || 'app.ip',
            );
          });
        }

        return promise;
      },
      goToExportCsv: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.dashboard.export-csv', params, transitionParams),
      goToFirewall: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.firewall', params, transitionParams),
      goToFirewallGame: /* @ngInject */ ($state) => (
        params,
        transitionParams,
      ) => $state.go('app.ip.firewall-game', params, transitionParams),
      goToFirewallToggle: /* @ngInject */ ($state) => (
        params,
        transitionParams,
      ) =>
        $state.go('app.ip.dashboard.firewall-toggle', params, transitionParams),
      goToMigration: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.dashboard.migration', params, transitionParams),
      goToOrder: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.dashboard.order', params, transitionParams),
      goToOrderLegacy: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.dashboard.order-legacy', params, transitionParams),
      goToMitigationStatistics: /* @ngInject */ ($state) => (
        params,
        transitionParams,
      ) =>
        $state.go(
          'app.ip.dashboard.mitigation.statistics',
          params,
          transitionParams,
        ),
      goToMitigationUpdate: /* @ngInject */ ($state) => (
        params,
        transitionParams,
      ) =>
        $state.go(
          'app.ip.dashboard.mitigation.update',
          params,
          transitionParams,
        ),
      goToOrganisation: /* @ngInject */ ($state) => (
        params,
        transitionParams,
      ) => $state.go('app.ip.organisation', params, transitionParams),
      goToOrganisationChange: /* @ngInject */ ($state) => (
        params,
        transitionParams,
      ) =>
        $state.go(
          'app.ip.dashboard.organisation.change',
          params,
          transitionParams,
        ),
      goToOrganisationView: /* @ngInject */ ($state) => (
        params,
        transitionParams,
      ) =>
        $state.go(
          'app.ip.dashboard.organisation.view',
          params,
          transitionParams,
        ),
      goToReverse: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.dashboard.reverse', params, transitionParams),
      goToReverseAdd: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.dashboard.reverse.add', params, transitionParams),
      goToReverseDelete: /* @ngInject */ ($state) => (
        params,
        transitionParams,
      ) =>
        $state.go('app.ip.dashboard.reverse.delete', params, transitionParams),
      goToReverseUpdate: /* @ngInject */ ($state) => (
        params,
        transitionParams,
      ) =>
        $state.go('app.ip.dashboard.reverse.update', params, transitionParams),
      goToVirtualMac: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.dashboard.virtual-mac', params, transitionParams),
      goToVirtualMacAdd: /* @ngInject */ ($state) => (
        params,
        transitionParams,
      ) =>
        $state.go('app.ip.dashboard.virtual-mac.add', params, transitionParams),
      goToVirtualMacDelete: /* @ngInject */ ($state) => (
        params,
        transitionParams,
      ) =>
        $state.go(
          'app.ip.dashboard.virtual-mac.delete',
          params,
          transitionParams,
        ),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
    },
    views: {
      ip: 'ipDashboard',
    },
    translations: { value: ['..', './reverse/update'], format: 'json' },
  });
};
