import upperFirst from 'lodash/upperFirst';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import uniq from 'lodash/uniq';
import { LANGUAGES, PATTERN, OTHER } from './hosting-cron.constants';

export default class HostingCron {
  /* @ngInject */
  constructor($q, $translate, Hosting, OvhHttp) {
    this.$q = $q;
    this.$translate = $translate;
    this.Hosting = Hosting;
    this.OvhHttp = OvhHttp;
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
    }).then((data) => {
      this.Hosting.resetCrons();
      return data;
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
    ).then((data) => {
      this.Hosting.resetCrons();
      return data;
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
    ).then((data) => {
      this.Hosting.resetCrons();
      return data;
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
}

angular.module('services').service('HostingCron', HostingCron);
