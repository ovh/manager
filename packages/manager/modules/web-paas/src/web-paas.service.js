import map from 'lodash/map';
import set from 'lodash/set';

import Project from './project.class';
import {
  CACHED_OBJECT_LIST_PAGES,
  X_PAGINATION_MODE,
} from './web-paas.constants';

export default class WebPaasService {
  /* @ngInject */
  constructor($http, $q, $translate, WucOrderCartService) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.WucOrderCartService = WucOrderCartService;
  }

  getProjects() {
    return this.$http
      .get('/webPaaS/subscription', {
        headers: {
          [X_PAGINATION_MODE]: CACHED_OBJECT_LIST_PAGES,
        },
      })
      .then(({ data }) => data);
  }

  getProjectDetails(projectId) {
    return this.$http
      .get(`/webPaaS/subscription/${projectId}`)
      .then(({ data }) => new Project(data));
  }

  getCapabilities(planCode, useTemplate) {
    return this.$http
      .get('/webPaaS/capabilities', {
        params: {
          planCode,
          useTemplate,
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
      map(catalog.plans, (plan) => {
        set(plan, 'vcpus', [
          {
            name: '1 vCPU',
            value: 1,
          },
        ]);
        return plan;
      });
      return catalog;
    });
  }
}
