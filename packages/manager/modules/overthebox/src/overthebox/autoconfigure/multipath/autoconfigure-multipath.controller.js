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

    this.interface = {};

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
    this.interface = {};
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
        gateway: this.interface.gateway,
        ip: this.interface.ipAddr,
        ipv6: this.interface.isIPv6,
        mtu: this.interface.mtu,
        netmask: this.interface.netmask,
        protocol: this.interface.protocol,
        multipath: this.interface.multipath,
        routingTable: this.interface.routingTable,
        type: this.interface.type,
      },
      priority: this.interface.priority,
    };

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
