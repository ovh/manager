import get from 'lodash/get';
import map from 'lodash/map';
import some from 'lodash/some';
import { OPENRC_VERSION } from './download-openrc/download-openrc.constants';
import { ALPHA_CHARACTERS_REGEX, REGION_CAPACITY } from './users.constants';

export default class PciProjectsProjectUsersService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    OvhApiCloudProject,
    OvhApiCloudProjectRegion,
    OvhApiCloudProjectUser,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiCloudProjectRegion = OvhApiCloudProjectRegion;
    this.OvhApiCloudProjectUser = OvhApiCloudProjectUser;
    this.ALPHA_CHARACTERS_REGEX = ALPHA_CHARACTERS_REGEX;
  }

  checkGlobalRegion(regions) {
    return some(regions, (region) =>
      this.ALPHA_CHARACTERS_REGEX.test(region.id),
    );
  }

  getAll(projectId) {
    this.OvhApiCloudProjectUser.v6().resetQueryCache();
    return this.OvhApiCloudProjectUser.v6().query({
      serviceName: projectId,
    }).$promise;
  }

  get(projectId, userId) {
    return this.OvhApiCloudProjectUser.v6().get({
      serviceName: projectId,
      userId,
    }).$promise;
  }

  add(projectId, { description }, roles) {
    return this.OvhApiCloudProjectUser.v6().save(
      {
        serviceName: projectId,
      },
      {
        description,
        roles,
      },
    ).$promise;
  }

  delete(projectId, { id: userId }) {
    return this.OvhApiCloudProjectUser.v6().delete({
      serviceName: projectId,
      userId,
    }).$promise;
  }

  regeneratePassword(projectId, { id: userId }) {
    return this.OvhApiCloudProjectUser.v6().password({
      serviceName: projectId,
      userId,
    }).$promise;
  }

  getRegions(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/region`, {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
        },
      })
      .then(({ data }) => data);
  }

  getStorageRegions(projectId) {
    return this.getRegions(projectId).then((regions) => {
      return regions.filter(({ services }) =>
        services.find(({ name }) => name === REGION_CAPACITY),
      );
    });
  }

  downloadOpenRc(projectId, { id: userId }, region, version) {
    return this.OvhApiCloudProjectUser.v6().openrc({
      serviceName: projectId,
      userId,
      region,
      version: get(OPENRC_VERSION, `V${version}`),
    }).$promise;
  }

  downloadRclone(projectId, { id: userId }, region) {
    return this.OvhApiCloudProjectUser.v6().rclone({
      serviceName: projectId,
      userId,
      region,
    }).$promise;
  }

  generateToken(projectId, { id: userId, password }) {
    return this.OvhApiCloudProjectUser.v6().token(
      {
        serviceName: projectId,
        userId,
      },
      {
        password,
      },
    ).$promise;
  }

  getProjectRoles(projectId) {
    return this.OvhApiCloudProject.v6()
      .role({
        serviceName: projectId,
      })
      .$promise.then((response) => {
        const roles = map(response.roles, ({ description, name, id }) => ({
          id,
          description,
          name,
        }));

        const buildRoles = (permissionRoles) =>
          map(roles, (role) => ({
            ...role,
            active: [...(permissionRoles || [])].includes(role.id),
          }));

        const services = map(response.services, ({ name, permissions }) => ({
          name,
          permissions: permissions.map(({ label, roles: permissionRoles }) => ({
            name: label,
            roles: buildRoles(permissionRoles),
          })),
        }));

        return {
          roles,
          services,
        };
      });
  }
}
