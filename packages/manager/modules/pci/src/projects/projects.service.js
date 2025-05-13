import map from 'lodash/map';

import { DEFAULT_PROJECT_KEY } from './projects.constant';
import { DISCOVERY_PROJECT_PLANCODE } from './project/project.constants';
import { CLOUD_PROJECT_STATE } from '../constants';
import Project from './Project.class';
import Quota from './quota.class';

export default class {
  /* @ngInject */
  constructor($http, $q, ovhUserPref, OvhApiCloudProjectQuota, publicCloud) {
    this.$http = $http;
    this.$q = $q;
    this.ovhUserPref = ovhUserPref;
    this.OvhApiCloudProjectQuota = OvhApiCloudProjectQuota;
    this.publicCloud = publicCloud;
  }

  getDefaultProject() {
    return this.ovhUserPref.getValue(DEFAULT_PROJECT_KEY).catch((err) => {
      if (err.status === 404) {
        return null;
      }
      throw err;
    });
  }

  getProjects(filters = [], sort = 'description', sortOrder = 'asc') {
    return this.$q
      .all([
        this.publicCloud.getProjects(filters, sort, sortOrder),
        this.publicCloud.getServices([
          {
            field: 'route.path',
            comparator: 'eq',
            reference: '/cloud/project/{serviceName}',
          },
        ]),
      ])
      .then(([projects, services]) =>
        map(
          projects,
          (project) =>
            new Project({
              ...project,
              service: services.find(
                (service) => project.project_id === service.resource.name,
              ),
            }),
        ),
      );
  }

  setAsDefaultProject(projectId) {
    return this.ovhUserPref.create(DEFAULT_PROJECT_KEY, { projectId });
  }

  removeDefaultProject() {
    return this.ovhUserPref.remove(DEFAULT_PROJECT_KEY);
  }

  getQuotas(projectId) {
    return this.OvhApiCloudProjectQuota.v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((quotas) => map(quotas, (quota) => new Quota(quota)))
      .catch(() => []);
  }

  getOrderFollowUp(orderId) {
    const endPoint = `/me/order/${orderId}/followUp`;
    return this.$http.get(endPoint).then(({ data }) => data);
  }

  getDiscoveryProject() {
    return this.getProjects([
      {
        field: 'planCode',
        comparator: 'eq',
        reference: DISCOVERY_PROJECT_PLANCODE,
      },
      {
        field: 'status',
        comparator: 'eq',
        reference: CLOUD_PROJECT_STATE.ok,
      },
    ])
      .then((projects) => projects[0] ?? null)
      .catch(() => null);
  }
}
