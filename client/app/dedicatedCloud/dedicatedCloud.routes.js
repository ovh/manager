import pccViewTemplate from './dashboard/dashboard.html';

angular
  .module('App')
  .config(/* @ngInject */ ($stateProvider, $urlServiceProvider) => {
    $stateProvider.state('app.dedicatedClouds', {
      resolve: {
        currentService: /* @ngInject */ (
          $transition$,
          DedicatedCloud,
        ) => DedicatedCloud.getSelected($transition$.params().productId, true),
        currentDrp: /* @ngInject */ (
          $transition$,
          dedicatedCloudDrp,
          DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
          DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
        ) => dedicatedCloudDrp.getPccDrpPlan($transition$.params().productId)
          .then((states) => {
            const existingPlan = states
              .find(({ state }) => state !== DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabled);

            // If no plan with state other than disabled, let's return the first datacenter plan
            const currentDrp = existingPlan || _.sortBy(states, 'datacenterId')[0];

            const drpVpnStatus = _.get(currentDrp, 'remoteSiteInformation.vpnConfigState');
            currentDrp.vpnStatus = drpVpnStatus;
            currentDrp.isWaitingVpnConfiguration = drpVpnStatus !== undefined
              && drpVpnStatus !== DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS.configured;

            currentDrp.state = dedicatedCloudDrp.constructor.formatStatus(currentDrp.state);

            return dedicatedCloudDrp
              .getDisableSuccessAlertPreference($transition$.params().productId)
              .then(() => {
                currentDrp.isSuccessAlertDisable = true;
              })
              .catch(() => {
                currentDrp.isSuccessAlertDisable = false;
              })
              .then(() => currentDrp);
          }),
        datacenterList: /* @ngInject */ ($stateParams, DedicatedCloud) => DedicatedCloud
          .getDatacenters($stateParams.productId).then(({ results }) => results),

        goToPccDashboard: /* @ngInject */ $state => (reload = false) => $state.go('app.dedicatedClouds', {}, { reload }),
      },
      url: '/configuration/dedicated_cloud/:productId',
      views: {
        '': {
          templateUrl: 'dedicatedCloud/dedicatedCloud.html',
          controller: 'DedicatedCloudCtrl',
          controllerAs: '$ctrl',
        },
        'pccView@app.dedicatedClouds': {
          template: pccViewTemplate,
        },
      },
      reloadOnSearch: false,
      translations: { value: ['.'], format: 'json' },
    });

    // ensure compatibility with links sended by emails
    // like #/configuration/dedicated_cloud/pcc-123456?action=confirmcancel&token=myToken
    // make a redirect to the new url of ui route
    $urlServiceProvider.rules.when('/configuration/dedicated_cloud/:productId?action&token', (match) => {
      if (match.action === 'confirmcancel') {
        return `/configuration/dedicated_cloud/${match.productId}/terminate-confirm?token=${match.token}`;
      }

      return false;
    });
  });
