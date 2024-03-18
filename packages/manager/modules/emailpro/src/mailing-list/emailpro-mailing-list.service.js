import assign from 'lodash/assign';
import chunk from 'lodash/chunk';
import drop from 'lodash/drop';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isBoolean from 'lodash/isBoolean';
import size from 'lodash/size';
import take from 'lodash/take';
import validator from 'validator';

export default class EmailProMXPlanMailingLists {
  /* @ngInject */
  constructor($rootScope, $q, $stateParams, $timeout, OvhHttp, Poller) {
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
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
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/mailingList/${name}`,
      {
        rootPath: 'apiv6',
        cache: this.cache.mailingList,
      },
    );
  }

  getMailingListLimits(moderatorMessage, forceRefresh) {
    return this.OvhHttp.get('/email/domain/mailingListLimits', {
      rootPath: 'apiv6',
      params: {
        moderatorMessage: isBoolean(moderatorMessage)
          ? moderatorMessage
          : false,
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

  updateMailingList(serviceName, name, { infos, options, timer }) {
    return this.OvhHttp.put(
      `/email/domain/${serviceName}/mailingList/${name}`,
      {
        rootPath: 'apiv6',
        data: infos,
      },
    )
      .then(() => {
        // use timeout in order to proceed to the first update safely
        // before proceeding to a new update on the same object (fix http error 409)
        const deferred = this.$q.defer();
        this.$timeout(() => {
          this.changeOptions(serviceName, name, {
            options,
          })
            .then((opts) => deferred.resolve(opts))
            .catch((error) => deferred.reject(error));
        }, timer);
        return deferred.promise;
      })
      .then((opts) => {
        if (get(opts, 'id', false)) {
          this.pollState(serviceName, {
            id: opts.id,
            mailingList: name,
            successStates: ['noState'],
            namespace: 'EmailProMXPlanMailingLists.update.poll',
          });
        }
      });
  }

  changeOptions(serviceName, name, data) {
    return this.OvhHttp.post(
      `/email/domain/${serviceName}/mailingList/${name}/changeOptions`,
      {
        rootPath: 'apiv6',
        data,
        broadcast: 'hosting.tabs.EmailProMXPlanMailingLists.refresh',
      },
    );
  }

  deleteMailingList(serviceName, name) {
    return this.OvhHttp.delete(
      `/email/domain/${serviceName}/mailingList/${name}`,
      {
        rootPath: 'apiv6',
        broadcast: 'hosting.tabs.EmailProMXPlanMailingLists.refresh',
      },
    );
  }

  getSubscribers(serviceName, opts) {
    let params = null;
    if (opts.email) {
      params = {
        email: opts.email,
      };
    }
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/mailingList/${opts.name}/subscriber`,
      {
        rootPath: 'apiv6',
        params,
        cache: this.cache.subscribers,
        clearAllCache: opts.forceRefresh,
      },
    );
  }

  getSubscriber(serviceName, name, email) {
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/mailingList/${name}/subscriber/${email}`,
      {
        rootPath: 'apiv6',
        cache: this.cache.subscriber,
      },
    );
  }

  createSubscriber(serviceName, name, data) {
    return this.OvhHttp.post(
      `/email/domain/${serviceName}/mailingList/${name}/subscriber`,
      {
        rootPath: 'apiv6',
        data,
        broadcast:
          'hosting.tabs.EmailProMXPlanMailingLists.subscribers.refresh',
      },
    );
  }

  addSubscribers(serviceName, opts, limit = 500) {
    return this.OvhHttp.post(
      `/email/domain/${serviceName}/mailinglist/${opts.mailingList}/users/add`,
      {
        rootPath: '2api',
        data: {
          users: take(opts.users, limit),
          type: opts.type,
        },
      },
    ).then((data) => {
      const users = drop(opts.users, limit);

      if (size(users) > 0) {
        return this.addSubscribers(
          serviceName,
          assign(opts, { users }),
          limit,
        ).then((d) => [data].concat(d));
      }

      return [data];
    });
  }

  deleteSubscribers(serviceName, opts, limit = 500) {
    return this.OvhHttp.delete(
      `/email/domain/${serviceName}/mailinglist/${opts.mailingList}/users/delete`,
      {
        rootPath: '2api',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        data: {
          users: take(opts.users, limit),
          type: opts.type,
        },
      },
    ).then((data) => {
      const users = drop(opts.users, limit);

      if (size(users) > 0) {
        return this.deleteSubscribers(
          serviceName,
          assign(opts, { users }),
        ).then((d) => [data].concat(d));
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
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/mailingList/${opts.name}/moderator`,
      {
        rootPath: 'apiv6',
        params,
        cache: this.cache.moderators,
        clearAllCache: opts.forceRefresh,
      },
    );
  }

  getModerator(serviceName, name, email) {
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/mailingList/${name}/moderator/${email}`,
      {
        rootPath: 'apiv6',
        cache: this.cache.moderator,
      },
    );
  }

  addModerators(serviceName, opts) {
    return this.$q
      .all(
        chunk(opts.users, 500).map((moderators) =>
          this.OvhHttp.post(
            `/email/domain/${serviceName}/mailinglist/${opts.mailingList}/users/add`,
            {
              rootPath: '2api',
              data: {
                users: moderators,
                type: opts.type,
              },
            },
          ),
        ),
      )
      .then((data) => data.pop());
  }

  deleteModerators(serviceName, opts) {
    return this.$q
      .all(
        chunk(opts.users, 500).map((moderators) =>
          this.OvhHttp.delete(
            `/email/domain/${serviceName}/mailinglist/${opts.mailingList}/users/delete`,
            {
              rootPath: '2api',
              headers: { 'Content-Type': 'application/json;charset=utf-8' },
              data: {
                users: moderators,
                type: opts.type,
              },
            },
          ).then((resp) => resp),
        ),
      )
      .then((data) => data.pop());
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
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/task/mailinglist/${opts.id}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  pollState(serviceName, opts) {
    if (!opts.id) {
      return this.$rootScope.$broadcast(`${opts.namespace}.error`, '');
    }

    if (!isArray(opts.successSates)) {
      // eslint-disable-next-line no-param-reassign
      opts.successSates = [opts.successSates];
    }

    this.$rootScope.$broadcast(`${opts.namespace}.start`, opts);

    return this.Poller.poll(
      `apiv6/email/domain/${serviceName}/task/mailinglist/${opts.id}`,
      null,
      {
        interval: 7000,
        successRule: {
          state: (task) => opts.successStates.indexOf(task.state) !== -1,
        },
        namespace: opts.namespace,
      },
    )
      .then((pollObject, task) =>
        this.$rootScope.$broadcast(`${opts.namespace}.done`, pollObject, task),
      )
      .catch((err) =>
        this.$rootScope.$broadcast(`${opts.namespace}.error`, err),
      )
      .finally(null, (task) =>
        this.$rootScope.$broadcast(`${opts.namespace}.start`, task),
      );
  }

  killAllPolling(opts) {
    this.Poller.kill({ namespace: opts.namespace });
  }

  sendListByEmail(serviceName, opts) {
    return this.OvhHttp.post(
      `/email/domain/${serviceName}/mailingList/${opts.name}/sendListByEmail`,
      {
        rootPath: 'apiv6',
        data: {
          email: opts.email,
        },
      },
    );
  }
}
