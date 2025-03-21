import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

const moduleName = 'ovhManagerBillingAutorenewTerminateVrack';

angular
  .module(moduleName, [
    angularTranslate,
    ngAtInternet,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('billing.autorenew.terminateVrack', {
        url: '/terminate-vrack?service&serviceType',
        views: {
          modal: {
            component: 'billingTerminateVrack',
          },
        },
        layout: 'modal',
        resolve: {
          goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
          service: /* @ngInject */ ($transition$) =>
            $transition$.params().service,
          isEmpty: /* @ngInject */ (OvhApiVrack, service) =>
            OvhApiVrack.Aapi()
              .services({ serviceName: service })
              .$promise.then((allServicesParam) => {
                const services = Object.entries(allServicesParam).filter(
                  ([, value]) => {
                    return Array.isArray(value) && value.length;
                  },
                );
                return !services.length;
              })
              .catch(() => {
                return false;
              }),
          breadcrumb: () => null,
        },
        atInternet: {
          ignore: true,
        },
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
