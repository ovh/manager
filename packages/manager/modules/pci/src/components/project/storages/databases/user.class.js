import Base from './base.class';

export default class User extends Base {
  constructor({
    createdAt,
    id,
    roles,
    status,
    username,
    acls,
    categories,
    channels,
    commands,
    keys,
    group,
  }) {
    super();
    this.updateData({
      createdAt,
      id,
      rolesArray: roles,
      status,
      username,
      acls,
      categories,
      channels,
      commands,
      keys,
      group,
    });
  }

  updateData({
    createdAt,
    id,
    rolesArray,
    status,
    username,
    acls,
    categories,
    channels,
    commands,
    keys,
    group,
  }) {
    Object.assign(this, {
      createdAt,
      id,
      rolesArray,
      status,
      username,
      acls,
      categories,
      channels,
      commands,
      keys,
      group,
    });
    this.roles = this.rolesArray?.map((role, index) => {
      return { id: index, name: role };
    });
  }
}
