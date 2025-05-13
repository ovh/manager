import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import { DEFAULT_PROJECT_KEY } from './index.constants';

export default class PublicCloud {
  /* @ngInject */
  constructor(coreConfig, iceberg, OvhApiCloudProject, ovhUserPref) {
    this.coreConfig = coreConfig;
    this.iceberg = iceberg;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.ovhUserPref = ovhUserPref;
  }

  getProjects(filters = [], sort = 'description', sortOrder = 'asc') {
    // Use Iceberg
    return filters
      .reduce(
        (promise, { field, comparator, reference }) =>
          promise.addFilter(field, comparator, reference),
        this.iceberg('/cloud/project')
          .query()
          .expand('CachedObjectList-Cursor'),
      )
      .sort(sort || 'description', sortOrder) // Doesn't work as long as cache is not enabled
      .execute(null, true)
      .$promise.then(({ data }) => data);
  }

  getServices(filters = [], sort = 'resource.product.name', sortOrder = 'asc') {
    // Use Iceberg
    return filters
      .reduce(
        (promise, { field, comparator, reference }) =>
          promise.addFilter(field, comparator, reference),
        this.iceberg('/services')
          .query()
          .expand('CachedObjectList-Cursor'),
      )
      .sort(sort, sortOrder)
      .execute(null, true)
      .$promise.then(({ data }) => data)
      .catch((error) => {
        if (error.status === 403) {
          return [];
        }
        throw error;
      });
  }

  getDefaultProject() {
    return this.getProjects([
      {
        field: 'status',
        comparator: 'in',
        reference: ['creating', 'ok'],
      },
    ]).then((projects) => {
      if (Array.isArray(projects) && !isEmpty(projects)) {
        const [firstProject] = projects;
        const { project_id: firstProjectId } = firstProject;
        const projectsIds = map(projects, 'project_id');

        return this.ovhUserPref
          .getValue(DEFAULT_PROJECT_KEY)
          .then((project) => {
            if (!projectsIds.includes(project.projectId)) {
              this.ovhUserPref.remove(DEFAULT_PROJECT_KEY);
              return null;
            }
            return project.projectId;
          })
          .catch((error) => {
            if (error.status === 404) {
              // No project is defined as favorite
              // Go on the first one :)
              return firstProjectId;
            }
            return Promise.reject(error);
          });
      }
      return null;
    });
  }

  getDiscoveryProject() {
    return this.getProjects([
      {
        field: 'planCode',
        comparator: 'eq',
        reference: 'project.discovery',
      },
      {
        field: 'status',
        comparator: 'eq',
        reference: 'ok',
      },
    ]).then((projects) => {
      if (projects?.length) {
        const [{ project_id: projectId }] = projects;
        return projectId;
      }
      return null;
    });
  }

  getUnpaidProjects() {
    return this.getServices([
      {
        field: 'route.path',
        comparator: 'eq',
        reference: '/cloud/project/{serviceName}',
      },
      {
        field: 'billing.lifecycle.current.state',
        comparator: 'eq',
        reference: 'unpaid',
      },
    ]);
  }
}
