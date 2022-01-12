export default class OverTheBoxAutoconfigureDhcp {
  /* @ngInject */
  constructor($http, $q, $translate) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
  }

  $onInit() {
    this.displayAddConfigButton = true;
    this.displayAddStaticLeaseButton = true;
    this.showAddConfig = false;
    this.showAddStaticLease = false;

    this.config = {
      interface: '',
      leaseDuration: '',
      offset: '',
      poolSize: '',
      priority: '',
    };

    this.staticLease = {
      hostname: '',
      ip: '',
      mac: '',
      priority: '',
    };

    return this.$q.all([this.loadConfig(), this.loadStaticLeases()]);
  }

  loadConfig() {
    this.configList = [];
    return this.$http
      .get(`/overTheBox/${this.serviceName}/configuration/dhcp/config`)
      .then((response) => {
        if (response.data) {
          this.configList = response.data;
        }
        return response.data;
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

  addConfig() {
    this.config.interface = '';
    this.config.leaseDuration = '';
    this.config.offset = '';
    this.config.poolSize = '';
    this.config.priority = '';
    this.showAddConfig = true;
    this.displayAddConfigButton = false;
  }

  createConfig() {
    this.errorMessage = '';
    this.successMessage = '';
    if (
      !this.config.leaseDuration &&
      !this.config.offset &&
      !this.config.poolSize &&
      !this.config.priority
    ) {
      return this.$q.resolve(null);
    }

    const params = {
      configuration: {
        leaseDuration: this.config.leaseDuration,
        offset: this.config.offset,
        poolSize: this.config.poolSize,
      },
      priority: this.config.priority,
    };

    if (this.config.interface) {
      params.configuration.interface = this.config.interface;
    }

    return this.$http
      .post(`/overTheBox/${this.serviceName}/configuration/dhcp/config`, params)
      .then((response) => {
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_dhcp_config_create_succeed',
        );

        // Reload config table
        this.loadConfig();
        this.showAddConfig = false;
        this.displayAddConfigButton = true;
        return response;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfigure_create_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }

  cancelCreateConfig() {
    this.showAddConfig = false;
    this.displayAddConfigButton = true;
  }

  removeConfig(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.$http
      .delete(
        `/overTheBox/${this.serviceName}/configuration/dhcp/config/${row.id}`,
      )
      .then((response) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_dhcp_config_remove_succeed',
        );

        // Reload config table
        this.loadConfig();
        return response;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfigure_remove_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }

  loadStaticLeases() {
    this.staticLeases = [];
    return this.$http
      .get(`/overTheBox/${this.serviceName}/configuration/dhcp/staticLease`)
      .then((response) => {
        if (response.data) {
          this.staticLeases = response.data;
        }
        return response.data;
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

  addStaticLease() {
    this.staticLease.hostname = '';
    this.staticLease.ip = '';
    this.staticLease.mac = '';
    this.staticLease.priority = '';
    this.showAddStaticLease = true;
    this.displayAddStaticLeaseButton = false;
  }

  createStaticLease() {
    this.errorMessage = '';
    this.successMessage = '';
    if (
      !this.staticLease.hostname &&
      !this.staticLease.ip &&
      !this.staticLease.mac &&
      !this.staticLease.priority
    ) {
      return this.$q.resolve(null);
    }

    const params = {
      configuration: {
        hostname: this.staticLease.hostname,
        ip: this.staticLease.ip,
        mac: this.staticLease.mac,
      },
      priority: this.staticLease.priority,
    };

    return this.$http
      .post(
        `/overTheBox/${this.serviceName}/configuration/dhcp/staticLease`,
        params,
      )
      .then((response) => {
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_dhcp_static_lease_create_succeed',
        );

        // Reload config table
        this.loadStaticLeases();
        this.showAddStaticLease = false;
        this.displayAddStaticLeaseButton = true;
        return response;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfigure_create_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }

  cancelCreateStaticLease() {
    this.showAddStaticLease = false;
    this.displayAddStaticLeaseButton = true;
  }

  removeStaticLease(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.$http
      .delete(
        `/overTheBox/${this.serviceName}/configuration/dhcp/staticLease/${row.id}`,
      )
      .then((response) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_dhcp_static_lease_remove_succeed',
        );

        // Reload config table
        this.loadStaticLeases();
        return response;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfigure_remove_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }
}
