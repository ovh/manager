export default class UseraccountUsersService {
  /* @ngInject */
  constructor(OvhHttp) {
    this.ovhHttp = OvhHttp;
  }

  getUsers() {
    return this.ovhHttp.get('/me/identity/user', {
      rootPath: 'apiv6',
    });
  }

  getUser(user) {
    return this.ovhHttp.get('/me/identity/user/{user}', {
      rootPath: 'apiv6',
      urlParams: {
        user,
      },
    });
  }

  addUser(data) {
    return this.ovhHttp.post('/me/identity/user', {
      rootPath: 'apiv6',
      data,
      broadcast: 'useraccount.security.users.refresh',
    });
  }

  updateUser({ login, email, description, group }) {
    return this.ovhHttp.put('/me/identity/user/{user}', {
      rootPath: 'apiv6',
      urlParams: {
        user: login,
      },
      data: {
        email,
        description,
        group,
      },
      broadcast: 'useraccount.security.users.refresh',
    });
  }

  deleteUser(user) {
    return this.ovhHttp.delete('/me/identity/user/{user}', {
      rootPath: 'apiv6',
      urlParams: {
        user: user.login,
      },
      broadcast: 'useraccount.security.users.refresh',
    });
  }

  enableUser(user) {
    return this.ovhHttp.post('/me/identity/user/{user}/enable', {
      rootPath: 'apiv6',
      urlParams: {
        user: user.login,
      },
      broadcast: 'useraccount.security.users.refresh',
    });
  }

  disableUser(user) {
    return this.ovhHttp.post('/me/identity/user/{user}/disable', {
      rootPath: 'apiv6',
      urlParams: {
        user: user.login,
      },
      broadcast: 'useraccount.security.users.refresh',
    });
  }

  getIdentityProvider() {
    return this.ovhHttp.get('/me/identity/provider', {
      rootPath: 'apiv6',
    });
  }

  addIdentityProvider(data) {
    return this.ovhHttp.post('/me/identity/provider', {
      rootPath: 'apiv6',
      data,
      broadcast: 'useraccount.security.users.refresh',
    });
  }

  updateIdentityProvider(data) {
    return this.ovhHttp.put('/me/identity/provider', {
      rootPath: 'apiv6',
      data: {
        groupAttributeName: data.groupAttributeName,
      },
      broadcast: 'useraccount.security.users.refresh',
    });
  }

  deleteIdentityProvider() {
    return this.ovhHttp.delete('/me/identity/provider', {
      rootPath: 'apiv6',
      broadcast: 'useraccount.security.users.refresh',
    });
  }
}
