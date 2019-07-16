angular.module('services').service(
  'EmailProMXPlanMailingLists',
  class EmailProMXPlanMailingLists {
    /**
         * Constructor
         * @param $rootScope
         * @param $q
         * @param $stateParams
         * @param OvhHttp
         * @param Poller
         */
    constructor($rootScope, $q, $stateParams, OvhHttp, Poller) {
      this.$rootScope = $rootScope;
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.OvhHttp = OvhHttp;
      this.Poller = Poller;

      this.cache = {
        EmailProMXPlanMailingLists: 'UNIVERS_WEB_MAILING_LIST',
        mailingList: 'UNIVERS_WEB_MAILING_LIST',
        subscribers: 'UNIVERS_WEB_MAILING_LIST_SUBSCRIBERS',
        subscriber: 'UNIVERS_WEB_MAILING_LIST_SUBSCRIBER',
        moderators: 'UNIVERS_WEB_MAILING_LIST_MODERATORS',
        moderator: 'UNIVERS_WEB_MAILING_LIST_MODERATOR',
        mailingListLimits: 'UNIVERS_WEB_MAILING_LIST_LIMITS',
      };
    }

    static isMailValid(addr) {
      return validator.isEmail(addr);
    }

    getModels() {
      return this.OvhHttp.get('/email/domain.json', {
        rootPath: 'apiv6',
      });
    }

    getEmailProMXPlanMailingLists(serviceName, opts) {
      return this.OvhHttp.get(`/email/domain/${serviceName}/mailingList`, {
        rootPath: 'apiv6',
        params: {
          name: opts.name,
        },
        cache: this.cache.EmailProMXPlanMailingLists,
        clearAllCache: opts.forceRefresh,
      });
    }

    getMailingList(serviceName, name) {
      return this.OvhHttp.get(`/email/domain/${serviceName}/mailingList/${name}`, {
        rootPath: 'apiv6',
        cache: this.cache.mailingList,
      });
    }

    getMailingListLimits(moderatorMessage, forceRefresh) {
      return this.OvhHttp.get('/email/domain/mailingListLimits', {
        rootPath: 'apiv6',
        params: {
          moderatorMessage: _.isBoolean(moderatorMessage) ? moderatorMessage : false,
        },
        cache: this.cache.mailingListLimits,
        clearAllCache: forceRefresh,
      });
    }

    createMailingList(serviceName, data) {
      return this.OvhHttp.post(`/email/domain/${serviceName}/mailingList`, {
        rootPath: 'apiv6',
        data,
        broadcast: 'hosting.tabs.EmailProMXPlanMailingLists.refresh',
      });
    }

    updateMailingList(serviceName, name, data) {
      return this.$q
        .all({
          mailingList: this.OvhHttp.put(`/email/domain/${serviceName}/mailingList/${name}`, {
            rootPath: 'apiv6',
            data: data.infos,
            broadcast: 'hosting.tabs.EmailProMXPlanMailingLists.refresh',
          }),
          options: this.changeOptions(serviceName, name, { options: data.options }),
        })
        .then(({ options }) => {
          if (_.get(options, 'id', false)) {
            this.pollState(serviceName, {
              id: options.id,
              mailingList: name,
              successStates: ['noState'],
              namespace: 'EmailProMXPlanMailingLists.update.poll',
            });
          }
        });
    }

    changeOptions(serviceName, name, data) {
      return this.OvhHttp.post(`/email/domain/${serviceName}/mailingList/${name}/changeOptions`, {
        rootPath: 'apiv6',
        data,
        broadcast: 'hosting.tabs.EmailProMXPlanMailingLists.refresh',
      });
    }

    deleteMailingList(serviceName, name) {
      return this.OvhHttp.delete(`/email/domain/${serviceName}/mailingList/${name}`, {
        rootPath: 'apiv6',
        broadcast: 'hosting.tabs.EmailProMXPlanMailingLists.refresh',
      });
    }

    getSubscribers(serviceName, opts) {
      let params = null;
      if (opts.email) {
        params = {
          email: opts.email,
        };
      }
      return this.OvhHttp.get(`/email/domain/${serviceName}/mailingList/${opts.name}/subscriber`, {
        rootPath: 'apiv6',
        params,
        cache: this.cache.subscribers,
        clearAllCache: opts.forceRefresh,
      });
    }

    getSubscriber(serviceName, name, email) {
      return this.OvhHttp.get(`/email/domain/${serviceName}/mailingList/${name}/subscriber/${email}`, {
        rootPath: 'apiv6',
        cache: this.cache.subscriber,
      });
    }

    createSubscriber(serviceName, name, data) {
      return this.OvhHttp.post(`/email/domain/${serviceName}/mailingList/${name}/subscriber`, {
        rootPath: 'apiv6',
        data,
        broadcast: 'hosting.tabs.EmailProMXPlanMailingLists.subscribers.refresh',
      });
    }

    addSubscribers(serviceName, opts, limit = 500) {
      return this.OvhHttp.post(`/email/domain/${serviceName}/mailinglist/${opts.mailingList}/users/add`, {
        rootPath: '2api',
        data: {
          users: _.take(opts.users, limit),
          type: opts.type,
        },
      })
        .then((data) => {
          const users = _.drop(opts.users, limit);

          if (_.size(users) > 0) {
            return this.addSubscribers(serviceName, _.assign(opts, { users }))
              .then(d => [data].concat(d));
          }

          return [data];
        });
    }

    deleteSubscribers(serviceName, opts, limit = 500) {
      return this.OvhHttp.delete(`/email/domain/${serviceName}/mailinglist/${opts.mailingList}/users/delete`, {
        rootPath: '2api',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        data: {
          users: _.take(opts.users, limit),
          type: opts.type,
        },
      })
        .then((data) => {
          const users = _.drop(opts.users, limit);

          if (_.size(users) > 0) {
            return this.deleteSubscribers(serviceName, _.assign(opts, { users }))
              .then(d => [data].concat(d));
          }

          return [data];
        });
    }

    getModerators(serviceName, opts) {
      let params = null;
      if (opts.email) {
        params = {
          email: opts.email,
        };
      }
      return this.OvhHttp.get(`/email/domain/${serviceName}/mailingList/${opts.name}/moderator`, {
        rootPath: 'apiv6',
        params,
        cache: this.cache.moderators,
        clearAllCache: opts.forceRefresh,
      });
    }

    getModerator(serviceName, name, email) {
      return this.OvhHttp.get(`/email/domain/${serviceName}/mailingList/${name}/moderator/${email}`, {
        rootPath: 'apiv6',
        cache: this.cache.moderator,
      });
    }

    addModerators(serviceName, opts) {
      return this.$q
        .all(_.chunk(opts.users, 500).map(moderators => this.OvhHttp.post(`/email/domain/${serviceName}/mailinglist/${opts.mailingList}/users/add`, {
          rootPath: '2api',
          data: {
            users: moderators,
            type: opts.type,
          },
        })))
        .then(data => data.pop());
    }

    deleteModerators(serviceName, opts) {
      return this.$q
        .all(_.chunk(opts.users, 500).map(moderators => this.OvhHttp
          .delete(`/email/domain/${serviceName}/mailinglist/${opts.mailingList}/users/delete`, {
            rootPath: '2api',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            data: {
              users: moderators,
              type: opts.type,
            },
          })
          .then(resp => resp)))
        .then(data => data.pop());
    }

    getTaskIds(serviceName, opts) {
      return this.OvhHttp.get(`/email/domain/${serviceName}/task/mailinglist`, {
        rootPath: 'apiv6',
        params: {
          account: opts.account,
        },
      });
    }

    getTask(serviceName, opts) {
      return this.OvhHttp.get(`/email/domain/${serviceName}/task/mailinglist/${opts.id}`, {
        rootPath: 'apiv6',
      });
    }

    pollState(serviceName, opts) {
      if (!opts.id) {
        return this.$rootScope.$broadcast(`${opts.namespace}.error`, '');
      }

      if (!_.isArray(opts.successSates)) {
        opts.successSates = [opts.successSates]; // eslint-disable-line no-param-reassign
      }

      this.$rootScope.$broadcast(`${opts.namespace}.start`, opts);

      return this.Poller
        .poll(`apiv6/email/domain/${serviceName}/task/mailinglist/${opts.id}`, null, {
          interval: 7000,
          successRule: {
            state: task => opts.successStates.indexOf(task.state) !== -1,
          },
          namespace: opts.namespace,
        })
        .then((pollObject, task) => this.$rootScope.$broadcast(`${opts.namespace}.done`, pollObject, task))
        .catch(err => this.$rootScope.$broadcast(`${opts.namespace}.error`, err))
        .finally(null, task => this.$rootScope.$broadcast(`${opts.namespace}.start`, task));
    }

    killAllPolling(opts) {
      this.Poller.kill({ namespace: opts.namespace });
    }

    sendListByEmail(serviceName, opts) {
      return this.OvhHttp.post(`/email/domain/${serviceName}/mailingList/${opts.name}/sendListByEmail`, {
        rootPath: 'apiv6',
        data: {
          email: opts.email,
        },
      });
    }
  },
);
