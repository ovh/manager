export default class OverTheBoxAutoconfigMultipath {
  /* @ngInject */
  constructor($http, $translate, OVERTHEBOX_MULTIPATH) {
    this.$http = $http;
    this.$translate = $translate;
    this.OVERTHEBOX_MULTIPATH = OVERTHEBOX_MULTIPATH;
  }

  $onInit() {
    this.displayAddInterfaceButton = true;
    this.showAddInterface = false;

    this.interface = {
      gateway: '',
      ifname: '',
      interfaceName: '',
      ipAddr: '',
      isIPv6: false,
      mtu: '',
      netmask: '',
      priority: '',
      protocol: '',
      multipath: '',
      routingTable: '',
      type: '',
    };

    return this.loadInterfaces();
  }

  loadInterfaces() {
    return this.$http
      .get(`/overTheBox/${this.serviceName}/configuration/network/interface`)
      .then((response) => {
        this.interfaces = response.data;
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

  addInterface() {
    this.interface.gateway = '';
    this.interface.ifname = '';
    this.interface.interfaceName = '';
    this.interface.ipAddr = '';
    this.interface.isIPv6 = false;
    this.interface.mtu = '';
    this.interface.netmask = '';
    this.interface.priority = '';
    this.interface.protocol = '';
    this.interface.routingTable = '';
    this.interface.type = '';
    this.showAddInterface = true;
    this.displayAddInterfaceButton = false;
  }

  createInterface() {
    this.errorMessage = '';
    this.successMessage = '';

    const params = {
      configuration: {
        ifname: this.interface.ifname,
        interfaceName: this.interface.interfaceName,
      },
      priority: this.interface.priority,
    };

    if (this.interface.gateway) {
      params.configuration.gateway = this.interface.gateway;
    }
    if (this.interface.ipAddr) {
      params.configuration.ip = this.interface.ipAddr;
    }
    if (this.interface.isIPv6) {
      params.configuration.ipv6 = this.interface.isIPv6;
    }
    if (this.interface.mtu) {
      params.configuration.mtu = this.interface.mtu;
    }
    if (this.interface.netmask) {
      params.configuration.netmask = this.interface.netmask;
    }
    if (this.interface.protocol) {
      params.configuration.protocol = this.interface.protocol;
    }
    if (this.interface.multipath) {
      params.configuration.multipath = this.interface.multipath;
    }
    if (this.interface.routingTable) {
      params.configuration.routingTable = this.interface.routingTable;
    }
    if (this.interface.type) {
      params.configuration.type = this.interface.type;
    }

    return this.$http
      .post(
        `/overTheBox/${this.serviceName}/configuration/network/interface`,
        params,
      )
      .then(() => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_multipath_interface_create_succeed',
        );

        // Reload interface table
        this.showAddInterface = false;
        this.displayAddInterfaceButton = true;
        return this.loadInterfaces();
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfigure_create_failed',
          { errorMessage: error.data.message },
        );
      });
  }

  cancelCreateInterface() {
    this.showAddInterface = false;
    this.displayAddInterfaceButton = true;
  }

  removeInterface(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.$http
      .delete(
        `/overTheBox/${this.serviceName}/configuration/network/interface/${row.id}`,
      )
      .then(() => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_multipath_interface_remove_succeed',
        );

        // Reload interfaces table
        return this.loadInterfaces();
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
