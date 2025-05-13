import find from 'lodash/find';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

export default class {
  $onInit() {
    this.columns = reduce(
      this.roles.roles,
      (model, { id }) => ({
        ...model,
        [id]: true,
      }),
      {},
    );
  }

  updateRolePermissions(role) {
    this.services = map(this.roles.services, (service) => ({
      name: service.name,
      permissions: map(service.permissions, (permission) => ({
        name: permission.name,
        role: find(permission.roles, { id: role.id }),
      })),
    }));
  }
}
