import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import punycode from 'punycode';

export default class wizardHostedCreationDomainConfiguration {
  /* @ngInject */
  constructor($q, OvhHttp, Poller, $timeout) {
    this.$q = $q;
    this.OvhHttp = OvhHttp;
    this.Poller = Poller;
    this.$timeout = $timeout;

    this.validationButtonText = '';
  }

  retrievingDomainNames() {
    return this.OvhHttp.get('/domain', {
      rootPath: 'apiv6',
    });
  }

  addingDomain(organizationName, exchangeService, data) {
    return this.OvhHttp.post(
      `/email/exchange/${organizationName}/service/${exchangeService}/domain`,
      {
        rootPath: 'apiv6',
        data,
      },
    );
  }

  polling(organizationName, exchangeService, task) {
    const taskId = get(task, 'id', task);

    return this.Poller.poll(
      `/email/exchange/${organizationName}/service/${exchangeService}/task/${taskId}`,
    );
  }

  retrievingTask(organizationName, exchangeService, task) {
    const taskId = get(task, 'id', task);

    return this.OvhHttp.get(
      `/email/exchange/${organizationName}/service/${exchangeService}/task/${taskId}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  retrievingDomain(organizationName, exchangeService, domainName) {
    const asciiDomainName = punycode.toASCII(domainName);

    return this.OvhHttp.get(
      `/email/exchange/${organizationName}/service/${exchangeService}/domain/${asciiDomainName}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  pollingCNAMEToCheck(
    organizationName,
    exchangeService,
    domainName,
    associatedTask,
    deferred = null,
  ) {
    let localDeferred = deferred;

    if (isEmpty(localDeferred)) {
      localDeferred = this.$q.defer();
    }

    if (associatedTask.status === 'todo') {
      this.retrievingDomain(organizationName, exchangeService, domainName)
        .then((domain) => {
          const cnameToCheck = get(domain, 'cnameToCheck');

          if (!isEmpty(cnameToCheck) || domain.taskPendingId === 0) {
            localDeferred.resolve(domain);
            return null;
          }

          return this.OvhHttp.get(
            `/email/exchange/${organizationName}/service/${exchangeService}/task/${domain.taskPendingId}`,
            {
              rootPath: 'apiv6',
            },
          );
        })
        .then((task) => {
          if (!isEmpty(task)) {
            this.$timeout(
              () =>
                this.pollingCNAMEToCheck(
                  organizationName,
                  exchangeService,
                  domainName,
                  task,
                  localDeferred,
                ),
              5000,
            );
          }
        });
    } else {
      this.retrievingDomain(organizationName, exchangeService, domainName).then(
        (domain) => {
          localDeferred.resolve(domain);
        },
      );
    }

    return localDeferred.promise;
  }
}
