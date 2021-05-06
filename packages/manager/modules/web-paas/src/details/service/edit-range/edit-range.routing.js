import { compact, find, map, set } from 'lodash';
import { addProjectResolves } from '../../../components/modify-plan/modify-plan.utils';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard.service.edit-range', {
    url: '/edit-range',
    views: {
      projectDetailsView: 'webPaasModifyPlan',
    },
    params: {
      cpu: null,
    },
    resolve: {
      ...addProjectResolves,
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
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('web_paas_add_project_title_edit'),
    },
  });
};
