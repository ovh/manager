import upperFirst from 'lodash/upperFirst';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import uniq from 'lodash/uniq';
import {
  LANGUAGES,
  PATTERN,
  OTHER,
  TASK_MAPPING,
} from './hosting-cron.constants';

export default class HostingCron {
  /* @ngInject */
  constructor($rootScope, $q, $http, $translate, Hosting, OvhHttp, Poll) {
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.Hosting = Hosting;
    this.OvhHttp = OvhHttp;
    this.Poll = Poll;
  }

  getCrons(serviceName, filters) {
    const promises = [];

    if (isArray(filters)) {
      filters.forEach((filter) => {
        promises.push(
          this.OvhHttp.get(['/hosting/web/{serviceName}/cron'].join('/'), {
            rootPath: 'apiv6',
            urlParams: {
              serviceName,
            },
            params: filter,
          }),
        );
      });
    } else {
      promises.push(
        this.OvhHttp.get(['/hosting/web/{serviceName}/cron'].join('/'), {
          rootPath: 'apiv6',
          urlParams: {
            serviceName,
          },
        }),
      );
    }

    return this.$q.allSettled(promises).then(
      (data) => {
        let result = [];
        data.forEach((res) => {
          result = result.concat(res);
        });
        return uniq(result);
      },
      (err) => this.$q.reject(err),
    );
  }

  getCron(serviceName, id) {
    return this.OvhHttp.get(['/hosting/web/{serviceName}/cron', id].join('/'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  }

  createCron(serviceName, model) {
    return this.OvhHttp.post('/hosting/web/{serviceName}/cron', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        command: model.command,
        description: model.description || undefined,
        email: model.email || undefined,
        frequency: model.frequency,
        language: model.language,
        status: model.status,
      },
    }).then((response) => {
      if (response.state !== 'ERROR') {
        this.pollingActions(serviceName, 'cron/create');
      }
      return response;
    });
  }

  deleteCron(serviceName, cronId) {
    return this.OvhHttp.delete(
      ['/hosting/web/{serviceName}/cron', cronId].join('/'),
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      },
    ).then((response) => {
      if (response.state !== 'ERROR') {
        this.pollingActions(serviceName, 'cron/delete');
      }
      return response;
    });
  }

  editCron(serviceName, cronId, model) {
    return this.OvhHttp.put(
      ['/hosting/web/{serviceName}/cron', cronId].join('/'),
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          command: model.command.startsWith('./')
            ? model.command.slice(2)
            : model.command,
          description: model.description || undefined,
          email: model.email || undefined,
          frequency: model.frequency,
          language: model.language,
          status: model.status,
        },
      },
    ).then((response) => {
      this.pollingActions(serviceName, 'cron/update');
      return response;
    });
  }

  getAvailableLanguage(serviceName) {
    return this.OvhHttp.get(
      '/hosting/web/{serviceName}/cronAvailableLanguage',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      },
    );
  }

  formatLanguage(language) {
    if (language && language.toLowerCase() === OTHER) {
      return this.$translate.instant('hosting_tab_CRON_table_language_OTHER');
    }

    if (language) {
      const versionIndex = language.search(PATTERN);
      const name = language.substring(0, versionIndex).replace('_', '');
      const version = language.substring(versionIndex).replace('_', '.');

      return `${get(
        LANGUAGES,
        name.toUpperCase(),
        upperFirst(name),
      )} ${version}`;
    }

    return language;
  }

  /**
   * Poll request
   * @param {object} opts
   */
  pollRequest(opts) {
    if (!isArray(opts.taskIds) || opts.taskIds.length <= 0) {
      this.$rootScope.$broadcast(`hostingDomain.${opts.namespace}.done`);
    } else {
      forEach(opts.taskIds, (taskId) => {
        this.Poll.poll(
          `apiv6/hosting/web/${opts.serviceName}/tasks/${taskId}`,
          null,
          {
            successRule: { state: 'done' },
            namespace: `hostingDomain.${opts.namespace}`,
          },
        )
          .then((task) => {
            this.$rootScope.$broadcast(
              `hostingDomain.${opts.namespace}.done`,
              task,
            );
          })
          .catch((err) => {
            this.$rootScope.$broadcast(
              `hostingDomain.${opts.namespace}.error`,
              err,
            );
          });
      });
    }
  }

  /**
   * pollingActions
   * @param {string} serviceName
   * @param {string} taskType
   */
  pollingActions(serviceName, taskType) {
    this.Hosting.resetCrons();
    this.Hosting.getTaskIds(serviceName, taskType).then((taskIds) => {
      this.pollRequest({
        serviceName,
        taskIds,
        namespace: TASK_MAPPING[taskType],
      });
    });
  }

  /**
   * Kill all polling
   */
  killAllPolling() {
    forEach(Object.values(TASK_MAPPING), (action) => {
      this.Poll.kill({ namespace: `hostingDomain.${action}` });
    });
  }
}

angular.module('services').service('HostingCron', HostingCron);
