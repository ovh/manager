import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import set from 'lodash/set';

export default class diagnostic {
  /* @ngInject */
  constructor($rootScope, wucExchange, OvhHttp, Poller) {
    this.services = {
      $rootScope,
      wucExchange,
      OvhHttp,
      Poller,
    };

    this.diagnosticCache = {};
  }

  cacheDiagnostic(email) {
    this.diagnosticCache = {
      organizationName: this.services.wucExchange.value.organization,
      exchangeService: this.services.wucExchange.value.domain,
      primaryEmailAddress: email,
    };
  }

  gettingLastDiagnostic() {
    if (
      this.diagnosticCache.organizationName ===
        this.services.wucExchange.value.organization &&
      this.diagnosticCache.exchangeService ===
        this.services.wucExchange.value.domain
    ) {
      return this.diagnosticCache.primaryEmailAddress;
    }

    return false;
  }

  launchingDiagnostic(email, password) {
    this.cacheDiagnostic(email);

    return this.services.OvhHttp.post(
      '/email/exchange/{organizationName}/service/{exchangeService}/account/{primaryEmailAddress}/diagnostics',
      {
        rootPath: 'apiv6',
        urlParams: {
          organizationName: this.services.wucExchange.value.organization,
          exchangeService: this.services.wucExchange.value.domain,
          primaryEmailAddress: email,
        },
        data: {
          password,
        },
      },
    );
  }

  gettingDiagnosticResult(email) {
    return this.services.OvhHttp.get(
      '/email/exchange/{organizationName}/service/{exchangeService}/account/{primaryEmailAddress}/diagnostics',
      {
        rootPath: 'apiv6',
        urlParams: {
          organizationName: this.services.wucExchange.value.organization,
          exchangeService: this.services.wucExchange.value.domain,
          primaryEmailAddress: email,
        },
      },
    );
  }

  clearCache() {
    this.diagnosticCache = {};
  }

  cacheLastDiagnosticResult(diagnosticResult) {
    this.diagnosticCache.diagnosticResult = diagnosticResult;
  }

  getCachedDiagnosticResult() {
    return this.diagnosticCache.diagnosticResult;
  }

  hasCachedDiagnosticResult() {
    return this.diagnosticCache.diagnosticResult != null;
  }

  gettingTasks(email) {
    return this.services.OvhHttp.get(
      '/email/exchange/{organizationName}/service/{exchangeService}/account/{primaryEmailAddress}/tasks',
      {
        rootPath: 'apiv6',
        urlParams: {
          organizationName: this.services.wucExchange.value.organization,
          exchangeService: this.services.wucExchange.value.domain,
          primaryEmailAddress: email,
        },
      },
    );
  }

  gettingTask(email, id) {
    return this.services.OvhHttp.get(
      '/email/exchange/{organizationName}/service/{exchangeService}/account/{primaryEmailAddress}/tasks/{id}',
      {
        rootPath: 'apiv6',
        urlParams: {
          organizationName: this.services.wucExchange.value.organization,
          exchangeService: this.services.wucExchange.value.domain,
          primaryEmailAddress: email,
          id,
        },
      },
    );
  }

  pollingState(email, opts) {
    if (opts.id == null) {
      return this.services.$rootScope.$broadcast(`${opts.namespace}.error`, '');
    }

    if (!isArray(opts.successSates)) {
      set(opts, 'successSates', [opts.successSates]);
    }

    const url = `apiv6/email/exchange/${this.services.wucExchange.value.organization}/service/${this.services.wucExchange.value.domain}/account/${email}/tasks/${opts.id}`;
    const pollParameters = {
      interval: 2000,
      successRule: {
        state: (task) => includes(opts.successSates, task.status),
      },
      namespace: opts.namespace,
    };

    return this.services.Poller.poll(url, null, pollParameters)
      .then(() => {
        this.services.$rootScope.$broadcast(`${opts.namespace}.done`);
      })
      .catch((err) => {
        this.services.$rootScope.$broadcast(`${opts.namespace}.error`, err);
      });
  }

  killAllPolling(opts) {
    this.services.Poller.kill({
      namespace: opts.namespace,
    });
  }
}
