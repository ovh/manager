{
  const cache = {
    modules: 'UNIVERS_HOSTING_MODULES',
    modulesLatest: 'UNIVERS_HOSTING_MODULES_LATEST',
    moduleAvailable: 'UNIVERS_HOSTING_MODULES_AVAILABLE',
    installedModules: 'UNIVERS_HOSTING_MODULES_INSTALLLED',
    installedModule: 'UNIVERS_HOSTING_MODULE_INSTALLLED',
    databases: 'UNIVERS_HOSTING_MODULES_DATABASES',
    attachedDomains: 'UNIVERS_HOSTING_MODULES_ATTACHED_DOMAINS',
    attachedDomain: 'UNIVERS_HOSTING_MODULES_ATTACHED_DOMAIN',
  };

  angular.module('services').service(
    'HostingModule',
    class HostingModule {
      /* @ngInject */
      constructor(OvhHttp) {
        this.OvhHttp = OvhHttp;
      }

      /**
       * Obtain service
       * @param {string} serviceName
       */
      getService(serviceName) {
        return this.OvhHttp.get(`/hosting/web/${serviceName}`, {
          rootPath: 'apiv6',
        });
      }

      /**
       * Obtain a list of available modules
       */
      getModulesList() {
        return this.OvhHttp.get('/hosting/web/moduleList', {
          rootPath: 'apiv6',
          params: {
            active: true,
          },
          cache: cache.modules,
        });
      }

      /**
       * Obtain a list of latest  modules
       */
      getModulesLatestList() {
        return this.OvhHttp.get('/hosting/web/moduleList', {
          rootPath: 'apiv6',
          params: {
            active: true,
            latest: true,
          },
          cache: cache.modulesLatest,
        });
      }

      /**
       * Obtain a module
       * @param {string} id
       */
      getAvailableModule(id) {
        return this.OvhHttp.get(`/hosting/web/moduleList/${id}`, {
          rootPath: 'apiv6',
          cache: cache.moduleAvailable,
        });
      }

      /**
       * Obtain a list of avalaibles databases
       * @param {string} serviceName
       */
      getDatabases(serviceName) {
        return this.OvhHttp.get(`/hosting/web/${serviceName}/database`, {
          rootPath: 'apiv6',
          params: {
            type: 'mysql',
          },
        });
      }

      /**
       * Obtain a database by name
       * @param {string} serviceName
       * @param {string} name
       */
      getDatabase(serviceName, name) {
        return this.OvhHttp.get(
          `/hosting/web/${serviceName}/database/${name}`,
          {
            rootPath: 'apiv6',
          },
        );
      }

      /**
       * Get database capabilities
       * @param {string} serviceName
       */
      getDatabasesCapabilities(serviceName) {
        return this.OvhHttp.get(
          `/hosting/web/${serviceName}/databaseCreationCapabilities`,
          { rootPath: 'apiv6' },
        );
      }

      /**
       * Obtain a list of installed modules
       * @param {string} serviceName
       * @param {object} opts
       */
      getModules(serviceName, opts) {
        return this.OvhHttp.get(`/hosting/web/${serviceName}/module`, {
          rootPath: 'apiv6',
          clearCache: opts.forceRefresh,
        });
      }

      /**
       * Obtain a an installed module
       * @param {string} serviceName
       * @param {string} id
       */
      getModule(serviceName, id) {
        return this.OvhHttp.get(`/hosting/web/${serviceName}/module/${id}`, {
          rootPath: 'apiv6',
          cache: cache.installedModule,
        });
      }

      /**
       * Obtain a attached domains
       * @param {string} serviceName
       */
      getAttachedDomains(serviceName) {
        return this.OvhHttp.get(`/hosting/web/${serviceName}/attachedDomain`, {
          rootPath: 'apiv6',
          cache: cache.attachedDomains,
        });
      }

      /**
       * Obtain a attached domain path
       * @param {string} serviceName
       * @param {string} domain
       */
      getAttachedDomainPath(serviceName, domain) {
        return this.OvhHttp.get(
          `/hosting/web/${serviceName}/attachedDomain/${domain}`,
          {
            rootPath: 'apiv6',
          },
        );
      }

      /**
       * Create a new module
       * @param {string} serviceName
       * @param {object} data
       */
      createModule(serviceName, data) {
        return this.OvhHttp.post(`/hosting/web/${serviceName}/module`, {
          rootPath: 'apiv6',
          data,
          broadcast: 'hosting.tabs.modules.refresh',
        });
      }

      /**
       * Reset the admin password of a module
       * @param {string} serviceName
       * @param {string} id
       */
      changePassword(serviceName, id) {
        return this.OvhHttp.post(
          `/hosting/web/${serviceName}/module/${id}/changePassword`,
          {
            rootPath: 'apiv6',
          },
        );
      }

      /**
       * Remove an installed module
       * @param {string} serviceName
       * @param {string} id
       */
      deleteModule(serviceName, id) {
        return this.OvhHttp.delete(`/hosting/web/${serviceName}/module/${id}`, {
          rootPath: 'apiv6',
          clearAllCache: true,
          broadcast: 'hosting.tabs.modules.refresh',
        });
      }
    },
  );
}
