export default class OverTheBoxAutoconfigureDns {
  /* @ngInject */
  constructor($http, $q, $translate) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
  }

  $onInit() {
    this.displayAddServerButton = true;
    this.displayAddLocalDomainButton = true;
    this.showAddServer = false;
    this.showAddLocalDomain = false;

    this.nameserver = {
      server: '',
      priority: '',
    };

    this.localDomain = {
      hostname: '',
      ip: '',
      priority: '',
    };

    return this.$q.all([this.loadLocalDomain(), this.loadNameserver()]);
  }

  loadLocalDomain() {
    return this.$http
      .get(`/overTheBox/${this.serviceName}/configuration/dns/localDomain`)
      .then((response) => {
        this.localDomains = response.data;
        return response;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfigure_loading_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }

  loadNameserver() {
    return this.$http
      .get(`/overTheBox/${this.serviceName}/configuration/dns/nameserver`)
      .then((response) => {
        this.nameServers = response.data;
        return response;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfigure_loading_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }

  addNameserver() {
    this.nameserver.server = '';
    this.nameserver.priority = '';
    this.showAddServer = true;
    this.displayAddServerButton = false;
  }

  createNameServer() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.nameserver.server && !this.nameserver.priority) {
      return this.$q.resolve(null);
    }

    const params = {
      configuration: {
        server: this.nameserver.server,
      },
      priority: this.nameserver.priority,
    };

    return this.$http
      .post(
        `/overTheBox/${this.serviceName}/configuration/dns/nameserver`,
        params,
      )
      .then((response) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_dns_server_create_succeed',
        );

        // Reload nameserver table
        this.loadNameserver();
        this.showAddServer = false;
        this.displayAddServerButton = true;
        return response;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfigure_create_failed',
          { errorMessage: error.data.message },
        );
      });
  }

  cancelCreateNameServer() {
    this.showAddServer = false;
    this.displayAddServerButton = true;
  }

  removeNameserver(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.$http
      .delete(
        `/overTheBox/${this.serviceName}/configuration/dns/nameserver/${row.id}`,
      )
      .then((response) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_dns_server_remove_succeed',
        );

        // Reload nameserver table
        this.loadNameserver();
        return response;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfigure_remove_failed',
          { errorMessage: error.data.message },
        );
      });
  }

  addLocalDomain() {
    this.localDomain.hostname = '';
    this.localDomain.ip = '';
    this.localDomain.priority = '';
    this.showAddLocalDomain = true;
    this.displayAddLocalDomainButton = false;
  }

  createLocalDomain() {
    this.errorMessage = '';
    this.successMessage = '';
    if (
      !this.localDomain.hostname &&
      !this.localDomain.ip &&
      !this.localDomain.priority
    ) {
      return this.$q.resolve(null);
    }

    const params = {
      configuration: {
        hostname: this.localDomain.hostname,
        ip: this.localDomain.ip,
      },
      priority: this.localDomain.priority,
    };

    return this.$http
      .post(
        `/overTheBox/${this.serviceName}/configuration/dns/localDomain`,
        params,
      )
      .then((response) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_dns_local_domain_create_succeed',
        );

        // Reload local domain table
        this.loadLocalDomain();
        this.showAddLocalDomain = false;
        this.displayAddLocalDomainButton = true;
        return response;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfigure_create_failed',
          { errorMessage: error.data.message },
        );
      });
  }

  cancelCreateLocalDomain() {
    this.showAddLocalDomain = false;
    this.displayAddLocalDomainButton = true;
  }

  removeLocalDomain(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.$http
      .delete(
        `/overTheBox/${this.serviceName}/configuration/dns/localDomain/${row.id}`,
      )
      .then((response) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_dns_local_domain_remove_succeed',
        );

        // Reload local domain table
        this.loadLocalDomain();
        return response;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfigure_remove_failed',
          { errorMessage: error.data.message },
        );
      });
  }
}
