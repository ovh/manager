import map from 'lodash/map';
import set from 'lodash/set';
import Project from './project.class';
import Plan from './plan.class';
import { BETA_PLAN_CODE } from './web-paas.constants';

export default class WebPaasService {
  /* @ngInject */
  constructor($http, $q, $translate, WucOrderCartService, iceberg) {
    this.$http = $http;
    this.$q = $q;
    this.iceberg = iceberg;
    this.$translate = $translate;
    this.WucOrderCartService = WucOrderCartService;
  }

  getProjects() {
    return this.iceberg('/webPaaS/subscription')
      .query()
      .expand('CachedObjectList-Pages')
      .execute({}, true)
      .$promise.then(({ data }) => data);
  }

  getProjectDetails(projectId) {
    return this.$http
      .get(`/webPaaS/subscription/${projectId}`)
      .then(({ data }) => new Project(data));
  }

  getCapabilities(planCode) {
    return this.$http
      .get('/webPaaS/capabilities', {
        params: {
          planCode,
        },
      })
      .then((res) => res.data);
  }

  terminateProject(projectId) {
    return this.$http
      .post(`/webPaaS/subscription/${projectId}/terminate`, {
        params: {
          serviceName: projectId,
        },
      })
      .then(({ data }) => data);
  }

  getCatalog(ovhSubsidiary) {
    return this.WucOrderCartService.getProductPublicCatalog(
      ovhSubsidiary,
      'webPaaS',
    ).then((catalog) => {
      set(
        catalog,
        'plans',
        map(catalog.plans, (plan) =>
          plan.planCode === BETA_PLAN_CODE ? new Plan(plan) : null,
        ),
      );
      return catalog;
    });
  }
}
