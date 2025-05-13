import clone from 'lodash/clone';
import snakeCase from 'lodash/snakeCase';

angular.module('services').service(
  'HostingUser',
  class HostingUser {
    /* @ngInject */
    constructor(Hosting, OvhHttp, Poller, $rootScope) {
      this.Hosting = Hosting;
      this.OvhHttp = OvhHttp;
      this.Poller = Poller;
      this.$rootScope = $rootScope;
    }

    /**
     * Delete a FTP user
     * @param {string} serviceName
     * @param {string} userId
     */
    deleteUser(serviceName, userId) {
      return this.OvhHttp.delete(`/hosting/web/${serviceName}/user/${userId}`, {
        rootPath: 'apiv6',
      }).then(() => {
        this.Hosting.resetUsers();
      });
    }

    /**
     * Update password for user
     * @param {string} serviceName
     * @param {string} userId
     * @param {string} password
     */
    changePassword(serviceName, userId, password) {
      return this.OvhHttp.post(
        `/hosting/web/${serviceName}/user/${userId}/changePassword`,
        {
          rootPath: 'apiv6',
          data: {
            password,
          },
        },
      );
    }

    /**
     * Add user
     * @param {string} serviceName
     * @param {string} login
     * @param {string} password
     * @param {string} home
     * @param {string} sshState
     */
    addUser(serviceName, login, password, home, sshState) {
      return this.OvhHttp.post(`/hosting/web/${serviceName}/user`, {
        rootPath: 'apiv6',
        data: {
          login,
          password,
          home,
          sshState,
        },
      }).then((resp) => {
        this.Hosting.resetUsers();
        return resp;
      });
    }

    /**
     * Update user
     * @param {string} serviceName
     * @param {object} opts
     */
    updateUser(serviceName, opts) {
      return this.OvhHttp.put(
        `/hosting/web/${serviceName}/user/${opts.login}`,
        {
          rootPath: 'apiv6',
          data: opts.data,
        },
      ).then(() => {
        this.Hosting.resetUsers();
      });
    }

    /**
     * Get user creation capabilities
     */
    getUserCreationCapabilities() {
      return this.Hosting.getModels().then((models) => ({
        maxUser: 1000,
        stateAvailable: models.models[
          'hosting.web.user.StateEnum'
        ].enum.map((m) => snakeCase(m).toUpperCase()),
      }));
    }

    /**
     * Get tasks
     * @param {string} serviceName
     * @param {object} opts
     */
    getTasks(serviceName, opts) {
      return this.OvhHttp.get(`/hosting/web/${serviceName}/tasks`, {
        rootPath: 'apiv6',
        params: opts.params,
      });
    }

    /**
     * Poll State
     * @param {string} serviceName
     * @param {object} opts
     * @returns {boolean}
     */
    pollState(serviceName, originalOpts) {
      const opts = clone(originalOpts);

      if (!opts.id) {
        return this.$rootScope.$broadcast(`${opts.namespace}.error`, '');
      }

      if (!Array.isArray(opts.successSates)) {
        opts.successSates = [opts.successSates];
      }

      this.$rootScope.$broadcast(`${opts.namespace}.start`, opts.id);
      return this.Poller.poll(
        `apiv6/hosting/web/${serviceName}/tasks/${opts.id}`,
        null,
        {
          interval: 5000,
          successRule: {
            state(task) {
              return opts.successSates.indexOf(task.state) !== -1;
            },
          },
          namespace: opts.namespace,
        },
      )
        .then((pollObject, task) => {
          this.$rootScope.$broadcast(
            `${opts.namespace}.done`,
            pollObject,
            task,
          );
        })
        .catch((err) => {
          this.$rootScope.$broadcast(`${opts.namespace}.error`, err);
        });
    }

    /**
     * Kill polling
     * @param {object} opts
     */
    killAllPolling(opts) {
      this.Poller.kill({ namespace: opts.namespace });
    }
  },
);
