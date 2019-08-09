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
