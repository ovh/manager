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
    });
    this.roles = this.rolesArray?.map((role, index) => {
      return { id: index, name: role };
    });
  }
}
