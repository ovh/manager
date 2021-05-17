import { compact, find, map, set } from 'lodash';
import { commonResolves } from '../../../add/add.utils';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard.service.change-offer', {
    url: '/change-offer',
    views: {
      projectDetailsView: 'webPaasChangeOfferComponent',
    },
    params: {
      cpu: null,
    },
    resolve: {
      ...commonResolves,
      cpu: /* @ngInject */ ($transition$) => $transition$.params().cpu,
      selectedProject: /* @ngInject */ (WebPaas, projectId) =>
        WebPaas.getProjectDetails(projectId),
      availablePlans: /* @ngInject */ (selectedProject, WebPaas, cpu) =>
        WebPaas.getUpgradeOffers(selectedProject.serviceId).then((data) => {
          if (cpu) {
            return compact(
              map(data, (plan) =>
                plan.productName === selectedProject.offer.split('-')[0]
                  ? plan
                  : null,
              ),
            );
          }
          return data;
        }),
      availableAddons: /* @ngInject */ (projectId, WebPaas, selectedProject) =>
        WebPaas.getAdditionalOption(projectId, selectedProject),
      catalog: /* @ngInject */ (WebPaas, user, availablePlans) =>
        WebPaas.getCatalog(user.ovhSubsidiary, availablePlans),

      goBack: /* @ngInject */ (goToProjectDetails) => goToProjectDetails,
      selectedPlan: /* @ngInject */ (catalog, selectedProject) =>
        selectedProject.setSelectedPlan(
          find(catalog.plans, { planCode: selectedProject.offer }),
        ),
      filterProductList: /* @ngInject */ (cpu, catalog, selectedProject) => {
        if (cpu) {
          return set(catalog, 'productList', [
            find(catalog.productList, {
              name: selectedProject.offer.split('-')[0],
            }),
          ]);
        }
        return null;
      },
      goToDeleteUser: /* @ngInject */ ($state) => (customer) =>
        $state.go('web-paas.dashboard.service.change-offer.delete-user', {
          customer,
        }),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('web_paas_change_offer_title_edit'),
      goToChangeOffer: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go('web-paas.dashboard.service.change-offer', {
          reload,
        });
        if (message) {
          promise.then(() => {
            Alerter[type](message, 'web_paas_dashboard_alert');
          });
        }

        return promise;
      },
    },
  });
};
