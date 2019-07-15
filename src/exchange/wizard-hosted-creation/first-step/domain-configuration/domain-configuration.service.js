angular.module('Module.exchange.services').service(
  'wizardHostedCreationDomainConfiguration',
  class wizardHostedCreationDomainConfiguration {
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
      const taskId = _(task).get('id', task);

      return this.Poller.poll(
        `/email/exchange/${organizationName}/service/${exchangeService}/task/${taskId}`,
      );
    }

    retrievingTask(organizationName, exchangeService, task) {
      const taskId = _(task).get('id', task);

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

      if (_(localDeferred).isEmpty()) {
        localDeferred = this.$q.defer();
      }

      if (associatedTask.status === 'todo') {
        this.retrievingDomain(organizationName, exchangeService, domainName)
          .then((domain) => {
            const cnameToCheck = _(domain).get('cnameToCheck');

            if (!_(cnameToCheck).isEmpty() || domain.taskPendingId === 0) {
              localDeferred.resolve(domain);
              return null;
            }

            return this.OvhHttp.get(
              `/email/exchange/${organizationName}/service/${exchangeService}/task/${
                domain.taskPendingId
              }`,
              {
                rootPath: 'apiv6',
              },
            );
          })
          .then((task) => {
            if (!_(task).isEmpty()) {
              this.$timeout(
                () => this.pollingCNAMEToCheck(
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
        this.retrievingDomain(organizationName, exchangeService, domainName).then((domain) => {
          localDeferred.resolve(domain);
        });
      }

      return localDeferred.promise;
    }
  },
);
