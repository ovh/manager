import map from 'lodash/map';

import Project from './project.class';
import {
  CACHED_OBJECT_LIST_PAGES,
  X_PAGINATION_MODE,
} from './platform-sh.constants';

export default class PlatformShService {
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

  updateName(projectId, name) {
    return this.$q.when(true);
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
        plan.vcpus = [
          {
            name: '1 vCPU',
            value: 1,
          },
        ];
        return plan;
      });
      return catalog;
    });
  }
}
