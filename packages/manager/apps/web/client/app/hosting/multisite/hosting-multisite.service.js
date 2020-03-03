import assign from 'lodash/assign';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import map from 'lodash/map';

angular.module('services').service(
  'HostingDomain',
  class HostingDomain {
    constructor($rootScope, $http, $q, Hosting, OvhHttp, Poll, constants) {
      this.$rootScope = $rootScope;
      this.$http = $http;
      this.$q = $q;
      this.Hosting = Hosting;
      this.OvhHttp = OvhHttp;
      this.Poll = Poll;
      this.constants = constants;

      this.aapiHostingPath = `${constants.aapiRootPath}hosting/web`;
    }

    /**
     * Delete domain of domains tab
     * @param {string} serviceName
     * @param {string} domain
     * @param {boolean} wwwNeeded
     * @param {boolean} autoconfigure
     */
    removeDomain(serviceName, domain, wwwNeeded, autoconfigure) {
      return this.OvhHttp.delete(
        `/sws/hosting/web/${serviceName}/domains-delete`,
        {
          rootPath: '2api',
          params: {
            domain,
            wwwNeeded,
            autoconfigure,
          },
        },
      ).then((response) => {
        if (response.state !== 'ERROR') {
          this.getTaskIds({ fn: 'web/detachDomain' }, serviceName).then(
            (taskIds) => {
              this.pollRequest({
                serviceName,
                taskIds,
                namespace: 'detachDomain',
              });
            },
          );
        }
        this.Hosting.resetDomains();
        this.getTaskIds({ fn: 'attachedDomain/delete' }, serviceName).then(
          (taskIds) => {
            this.pollRequest({
              serviceName,
              taskIds,
              namespace: 'modifyDomain',
            });
          },
        );
      });
    }

    /**
     * Add domain of domains tab
     * @param {string} baseDomain
     * @param {string} domainName
     * @param {string} home
     * @param {boolean} wwwNeeded
     * @param {boolean} ipv6Needed
     * @param {boolean} autoconfigure
     * @param {string} cdn
     * @param {string} countryIp
     * @param {string} firewall
     * @param ownLog
     * @param {boolean} ssl
     * @param {string|null} runtimeId
     * @param {string} serviceName
     */
    addDomain(
      baseDomain,
      domainName,
      home,
      wwwNeeded,
      ipv6Needed,
      autoconfigure,
      cdn,
      countryIp,
      firewall,
      ownLog,
      ssl,
      runtimeId,
      serviceName,
    ) {
      return this.$http
        .put(`${this.aapiHostingPath}/${serviceName}/domains`, {
          baseDomain,
          domainName,
          home,
          wwwNeeded,
          ipv6Needed,
          autoconfigure,
          cdn: cdn.toLowerCase(),
          countryIp,
          firewallNeeded: firewall.toLowerCase(),
          ownLog,
          ssl,
          runtimeId,
        })
        .then((response) => {
          this.Hosting.resetDomains();
          this.getTaskIds({ fn: 'attachedDomain/create' }, serviceName).then(
            (taskIds) => {
              this.pollRequest({
                serviceName,
                taskIds,
                namespace: 'modifyDomain',
              });
            },
          );
          return response.data;
        });
    }

    /**
     * Update domain of domains tab
     * @param {string} domain
     * @param {string} home
     * @param {boolean} wwwNeeded
     * @param {boolean} ipv6Needed
     * @param {string} cdn
     * @param {string} countryIp
     * @param {string} firewall
     * @param ownLog
     * @param {boolean} ssl
     * @param {string|null} runtimeId
     * @param {string} serviceName
     */
    modifyDomain(
      domain,
      home,
      wwwNeeded,
      ipv6Needed,
      cdn,
      countryIp,
      firewall,
      ownLog,
      ssl,
      runtimeId,
      serviceName,
    ) {
      return this.getZoneLinked(domain)
        .then((urlSplitted) => {
          let baseDomain;
          let domainName;

          if (urlSplitted.zone) {
            baseDomain = urlSplitted.zone;
            domainName = urlSplitted.subDomain;
          } else {
            baseDomain = domain;
            domainName = null;
          }

          return this.addDomain(
            baseDomain,
            domainName,
            home,
            wwwNeeded,
            ipv6Needed,
            !!urlSplitted.zone,
            cdn.toLowerCase(),
            countryIp,
            firewall.toLowerCase(),
            ownLog,
            ssl,
            runtimeId,
            serviceName,
          );
        })
        .then((response) => {
          this.Hosting.resetDomains();
          this.getTaskIds({ fn: 'attachedDomain/update' }, serviceName).then(
            (taskIds) => {
              this.pollRequest({
                serviceName,
                taskIds,
                namespace: 'modifyDomain',
              });
            },
          );
          return response.data;
        });
    }

    /**
     * Get existing domain
     * @param {string} serviceName
     * @param tokenNeeded
     */
    getExistingDomains(serviceName, tokenNeeded) {
      return this.OvhHttp.get(
        `/sws/hosting/web/${serviceName}/add-domain-existing`,
        {
          rootPath: '2api',
          params: {
            tokenNeeded,
          },
        },
      );
    }

    /**
     *
     * @param {string} serviceName
     * @param {string} domain
     * @param {string} subDomain
     * @param {boolean} wwwNeeded
     */
    getExistingConfiguration(serviceName, domain, subDomain, wwwNeeded) {
      return this.$http
        .get(
          `${this.aapiHostingPath}/${serviceName}/domains/${domain}/configuration`,
          {
            params: {
              domainName: subDomain,
              wwwNeeded,
            },
          },
        )
        .then((response) => response.data);
    }

    /**
     * Get domain creation options
     */
    getAddDomainOptions() {
      return this.OvhHttp.get('/domain/zone', {
        rootPath: 'apiv6',
      }).then((zones) => {
        const zonesJava = map(zones, (zone) => ({
          displayName: zone,
          formattedName: zone,
          name: zone,
        }));

        return {
          availableDomains: zonesJava,
        };
      });
    }

    /**
     * Get task ids
     * @param {object} opts
     * @param {string} serviceName
     */
    getTaskIds(opts, serviceName) {
      const fn = opts.fn || '';
      return this.$http
        .get(`apiv6/hosting/web/${serviceName}/tasks`, {
          params: {
            function: fn,
          },
        })
        .then((response) => response.data);
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
          this.$rootScope.$broadcast(
            `hostingDomain.${opts.namespace}.start`,
            opts,
          );

          this.Poll.poll(
            `apiv6/hosting/web/${opts.serviceName}/tasks/${taskId}`,
            null,
            {
              successRule: { state: 'done' },
              namespace: 'hostingDomain.request',
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
     * Kill all polling
     */
    killAllPolling() {
      forEach(['detachDomain', 'attachDomain', 'modifyDomain'], (action) => {
        this.Poll.kill({ namespace: `hostingDomain.${action}` });
      });
    }

    /**
     * Get records
     * @param {string} domain
     * @param {string} subDomain
     * @param {string} fieldType
     */
    getRecords(domain, subDomain, fieldType) {
      return this.OvhHttp.get(`domain/${domain}/record`, {
        params: {
          subDomain,
          fieldType,
        },
      }).then((response) => response.data);
    }

    /**
     * Get zones
     */
    getZones() {
      return this.OvhHttp.get('/domain/zone', {
        rootPath: 'apiv6',
      });
    }

    /**
     * Get zone linked
     * @param {string} url
     */
    getZoneLinked(url) {
      const zoneAssociated = {};

      return this.getZones().then((zones) => {
        const urlSplitted = url.split('.');

        for (
          let index = 0;
          index < urlSplitted.length - 1 && !zoneAssociated.zone;
          index += 1
        ) {
          const zoneIndex = zones.indexOf(urlSplitted.slice(index).join('.'));

          if (zoneIndex !== -1) {
            zoneAssociated.zone = zones[zoneIndex];
            zoneAssociated.subDomain = urlSplitted.slice(0, index).join('.');
          }
        }

        return zoneAssociated;
      });
    }

    /**
     * Get IPv6 configuration
     * @param {string} serviceName
     * @param {string} search
     */
    getIPv6Configuration(serviceName, search) {
      return this.OvhHttp.get(`/sws/domain/${serviceName}/zone/records`, {
        rootPath: '2api',
        params: {
          search,
          searchedType: 'AAAA',
        },
      })
        .then((data) => get(data, 'paginatedZone.records.results'))
        .catch((error) => {
          if (error.code === 404) {
            return this.$q.resolve([]);
          }

          return this.$q.reject(error);
        });
    }

    /**
     * Get attached domains
     * @param {string} serviceName
     */
    getAttachedDomains(serviceName, options) {
      return this.OvhHttp.get(
        `/hosting/web/${serviceName}/attachedDomain`,
        assign(
          {
            rootPath: 'apiv6',
          },
          options,
        ),
      );
    }

    /**
     * Get attached domains
     * @param {string} serviceName
     * @param {string} attachedDomain
     */
    getAttachedDomain(serviceName, attachedDomain) {
      return this.OvhHttp.get(
        `/hosting/web/${serviceName}/attachedDomain/${attachedDomain}`,
        {
          rootPath: 'apiv6',
        },
      );
    }

    /**
     * Update attached domain
     * @param {string} serviceName
     * @param {string} attachedDomain
     * @param {object} data
     */
    updateAttachedDomain(serviceName, attachedDomain, data) {
      return this.OvhHttp.put(
        `/hosting/web/${serviceName}/attachedDomain/${attachedDomain}`,
        {
          rootPath: 'apiv6',
          data,
        },
      );
    }

    restartVirtualHostOfAttachedDomain(serviceName, attachedDomain) {
      return this.OvhHttp.post(
        `/hosting/web/${serviceName}/attachedDomain/${attachedDomain}/restart`,
        {
          rootPath: 'apiv6',
        },
      );
    }

    /**
     * Poll for restart of attached domain
     * @param {string} serviceName
     * @param {string} attachedDomain
     */
    pollRestartDomain(serviceName, attachedDomain) {
      return this.Poll.poll(
        `/hosting/web/${serviceName}/attachedDomain/${attachedDomain}`,
        null,
        {
          namespace: 'hostingDomain.request',
          successRule: { status: 'created' },
        },
      )
        .then((task) => {
          this.$rootScope.$broadcast('hostingDomain.restart.done', task);
        })
        .catch((err) => {
          this.$rootScope.$broadcast('hostingDomain.restart.error', err);
        });
    }

    pollSslTask(serviceName) {
      this.$rootScope.$broadcast('hostingDomain.regenerateSsl.start');
      return this.Poll.poll(`/hosting/web/${serviceName}/ssl/`, null, {
        namespace: 'hostingDomain.request',
        interval: 30000,
        successRule: { status: 'created' },
      })
        .then((task) => {
          this.$rootScope.$broadcast('hostingDomain.regenerateSsl.done', task);
        })
        .catch((err) => {
          this.$rootScope.$broadcast('hostingDomain.regenerateSsl.error', err);
        });
    }

    /**
     * Get runtime linked to an attached domain
     *
     * @param serviceName
     * @param runtimeId
     */
    getRuntimeConfiguration(serviceName, runtimeId) {
      return this.OvhHttp.get(
        `/hosting/web/${serviceName}/runtime/${runtimeId}`,
        {
          rootPath: 'apiv6',
        },
      );
    }
  },
);
