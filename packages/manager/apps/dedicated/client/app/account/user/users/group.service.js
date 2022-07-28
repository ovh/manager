export default class UseraccountGroupsService {
  /* @ngInject */
  constructor(OvhHttp) {
    this.ovhHttp = OvhHttp;
  }

  getGroups() {
    return this.ovhHttp.get('/me/identity/group', {
      rootPath: 'apiv6',
    });
  }

  getGroup(group) {
    return this.ovhHttp.get('/me/identity/group/{group}', {
      rootPath: 'apiv6',
      urlParams: {
        group,
      },
    });
  }

  addGroup(group) {
    return this.ovhHttp.post('/me/identity/group', {
      rootPath: 'apiv6',
      data: {
        name: group.name,
        description: group.description,
        role: group.role,
      },
      broadcast: 'useraccount.security.users.refresh',
    });
  }

  updateGroup(group) {
    return this.ovhHttp.put('/me/identity/group/{group}', {
      rootPath: 'apiv6',
      urlParams: {
        group: group.name,
      },
      data: {
        description: group.description,
        role: group.role,
      },
      broadcast: 'useraccount.security.users.refresh',
    });
  }

  deleteGroup(group) {
    return this.ovhHttp.delete('/me/identity/group/{group}', {
      rootPath: 'apiv6',
      urlParams: {
        group: group.name,
      },
      broadcast: 'useraccount.security.users.refresh',
    });
  }
}
