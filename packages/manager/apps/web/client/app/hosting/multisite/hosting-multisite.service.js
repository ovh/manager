import assign from 'lodash/assign';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import map from 'lodash/map';

angular.module('services').service(
  'HostingDomain',
  class HostingDomain {
    /* @ngInject */
    constructor(
      $rootScope,
      $http,
      $q,
      Hosting,
      iceberg,
      OvhHttp,
      Poll,
      constants,
    ) {
      this.$rootScope = $rootScope;
      this.$http = $http;
      this.$q = $q;
      this.Hosting = Hosting;
      this.iceberg = iceberg;
      this.OvhHttp = OvhHttp;
      this.Poll = Poll;
      this.constants = constants;

      this.aapiHostingPath = `${constants.aapiRootPath}hosting/web`;
    }

    /**
     * Request deletion of an attached domain
     * @param {string} serviceName
     * @param {string} domain
     * @param {boolean} bypassDNSConfiguration
     */
    requestAttachedDomainDelete(serviceName, domain, bypassDNSConfiguration) {
      return this.$http.delete(
        `/hosting/web/${serviceName}/attachedDomain/${domain}?bypassDNSConfiguration=${bypassDNSConfiguration}`,
      );
    }

    /**
     * Request update of an attached domain
     * @param {string} serviceName
     * @param {string} domain
     * @param {string} cdn
     * @param {string} firewall
     * @param {string|null} ownLog
     * @param {string} path
     * @param {string|null} runtimeId
     * @param {boolean} ssl
     * @param {boolean} bypassDNSConfiguration
     * @param {string} ipLocation
     */
    requestAttachedDomainUpdate(
      serviceName,
      domain,
      cdn,
      firewall,
      ownLog,
      path,
      runtimeId,
      ssl,
      bypassDNSConfiguration,
      ipLocation,
    ) {
      const payload = {
        cdn,
        firewall,
        ownLog,
        path,
        runtimeId,
        ssl,
        bypassDNSConfiguration,
      };

      if (ipLocation != null) {
        payload.ipLocation = ipLocation;
      }

      return this.$http.put(
        `/hosting/web/${serviceName}/attachedDomain/${domain}`,
        payload,
      );
    }

    /**
     * Request creation of an attached domain
     * @param {string} serviceName
     * @param {string} domain
     * @param {string} cdn
     * @param {string} firewall
     * @param ownLog
     * @param path
     * @param {string|null} runtimeId
     * @param {boolean} ssl
     * @param {boolean} bypassDNSConfiguration
     * @param {string} ipLocation
     */
    requestAttachedDomainCreate(
      serviceName,
      domain,
      cdn,
      firewall,
      ownLog,
      path,
      runtimeId,
      ssl,
      bypassDNSConfiguration,
      ipLocation,
    ) {
      return this.$http.post(`/hosting/web/${serviceName}/attachedDomain`, {
        cdn,
        domain,
        firewall,
        ownLog,
        path,
        runtimeId,
        ssl,
        bypassDNSConfiguration,
        ipLocation,
      });
    }

    /**
     * Delete domain of domains tab
     * @param {string} serviceName
     * @param {string} domain
     * @param {boolean} wwwNeeded
     * @param {boolean} autoconfigure
     */
    removeDomain(serviceName, domain, wwwNeeded, autoconfigure) {
      const deleteDomain = this.requestAttachedDomainDelete(
        serviceName,
        domain,
        !autoconfigure,
      );

      const promises = [deleteDomain];

      if (wwwNeeded) {
        const deleteDomainwww = this.requestAttachedDomainDelete(
          serviceName,
          `www.${domain}`,
          !autoconfigure,
        );

        promises.push(deleteDomainwww);
      }

      return this.$q.all(promises).then(() => {
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
     * @param {boolean} autoconfigure
     * @param {string} cdn
     * @param {Object} countryIp
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
      autoconfigure,
      cdn,
      countryIp,
      firewall,
      ownLog,
      ssl,
      runtimeId,
      serviceName,
    ) {
      const completeDomain = domainName
        ? `${domainName}.${baseDomain}`
        : baseDomain;

      const ipLocation = countryIp?.country ? countryIp.country : null;

      const addDomain = this.requestAttachedDomainCreate(
        serviceName,
        completeDomain,
        cdn.toLowerCase(),
        firewall.toLowerCase(),
        ownLog,
        home,
        runtimeId,
        ssl,
        !autoconfigure,
        ipLocation,
      );

      const promises = [addDomain];

      if (wwwNeeded) {
        const addDomainwww = this.requestAttachedDomainCreate(
          serviceName,
          `www.${completeDomain}`,
          cdn.toLowerCase(),
          firewall.toLowerCase(),
          ownLog,
          home,
          runtimeId,
          ssl,
          !autoconfigure,
          ipLocation,
        );

        promises.push(addDomainwww);
      }

      return this.$q.all(promises).then(() => {
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
      });
    }

    /**
     * Update domain of domains tab
     * @param {string} domain
     * @param {string} home
     * @param {boolean} wwwNeeded
     * @param {string} cdn
     * @param {Object} countryIp
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
      cdn,
      countryIp,
      firewall,
      ownLog,
      ssl,
      runtimeId,
      serviceName,
    ) {
      const ipLocation = countryIp?.country ? countryIp.country : null;

      const updateDomain = this.requestAttachedDomainUpdate(
        serviceName,
        domain,
        cdn.toLowerCase(),
        firewall.toLowerCase(),
        ownLog,
        home,
        runtimeId,
        ssl,
        false,
        ipLocation,
      );

      const promises = [updateDomain];

      if (wwwNeeded) {
        const updateDomainwww = this.requestAttachedDomainUpdate(
          serviceName,
          `www.${domain}`,
          cdn.toLowerCase(),
          firewall.toLowerCase(),
          ownLog,
          home,
          runtimeId,
          ssl,
          false,
          ipLocation,
        );

        promises.push(updateDomainwww);
      }

      return this.$q.all(promises).then(() => {
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
      return this.$http
        .get(`/domain/zone/${domain}/record`, {
          params: {
            subDomain,
            fieldType,
          },
        })
        .then(({ data }) => data);
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
     * Get service infos
     * @param {string} zone
     */
    getZoneServiceInfos(zone) {
      return this.$http
        .get(`/domain/zone/${zone}/serviceInfos`)
        .then(({ data }) => data);
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

    getDetailedAttachedDomains(serviceName) {
      return this.iceberg(`/hosting/web/${serviceName}/attachedDomain`)
        .query()
        .expand('CachedObjectList-Pages')
        .limit(50000)
        .execute()
        .$promise.then(({ data: attachedDomains }) => attachedDomains);
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
     * Get Dig Status
     * @param {string} serviceName
     * @param {string} attachedDomain
     */
    getDigStatus(serviceName, attachedDomain) {
      return this.$http
        .get(
          `/hosting/web/${serviceName}/attachedDomain/${attachedDomain}/digStatus`,
        )
        .then(({ data }) => data);
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

    /**
     * Get capability to create git association
     *
     * @param serviceName
     */
    websiteCreationCapabilities(serviceName) {
      return this.$http
        .get(`/hosting/web/${serviceName}/websiteCreationCapabilities`)
        .then(({ data }) => data);
    }

    getWebsitesAssociated(serviceName, path) {
      return this.$http
        .get(`/hosting/web/${serviceName}/website?path=${path}`)
        .then(({ data }) => data);
    }
  },
);
