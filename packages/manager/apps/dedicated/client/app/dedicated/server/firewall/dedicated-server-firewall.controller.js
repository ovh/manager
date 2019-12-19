import get from 'lodash/get';

angular.module('App')
  .controller('ServerTabFirewallAsaCtrl', class ServerTabFirewallAsaCtrl {
    constructor($q, $scope, $stateParams, Alerter, Server, ServerFirewallAsa, $translate) {
      this.$q = $q;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.Alerter = Alerter;
      this.Server = Server;
      this.ServerFirewallAsa = ServerFirewallAsa;
      this.$translate = $translate;

      this.$scope.$on(this.ServerFirewallAsa.events.firewallAsaChanged, () => this.$onInit());
    }

    $onInit() {
      this.server = null;
      this.canOrderAsaOption = false;
      this.informations = null;

      this.isLoading = true;
      return this.$q
        .all({
          server: this.getServer(),
          optionList: this.getOptionList(),
          informations: this.getInformations(),
        })
        .catch((err) => this.Alerter.error([this.$translate.instant('server_configuration_firewall_fail'), get(err, 'message', '')].join(' '), 'dedicated_server_firewall'))
        .finally(() => {
          this.isLoading = false;
        });
    }

    /**
         * Get selected server.
         * @return {Promise}
         */
    getServer() {
      return this.Server
        .getSelected(this.$stateParams.productId)
        .then((server) => {
          this.server = server;
          return server;
        })
        .catch((err) => this.$q.reject(err));
    }

    /**
         * Get option list.
         * @return {Promise}
         */
    getOptionList() {
      return this.ServerFirewallAsa
        .getOptionList(this.$stateParams.productId)
        .then((availableOptions) => {
          if (availableOptions && availableOptions.results.length > 0) {
            this.canOrderAsaOption = true;
          }
        })
        .catch((err) => this.$q.reject(err));
    }

    /**
         * Get informations.
         * @return {Promise}
         */
    getInformations() {
      return this.ServerFirewallAsa
        .getInformations(this.$stateParams.productId)
        .then((informations) => {
          this.informations = informations;
          return informations;
        })
        .catch((err) => this.$q.reject(err));
    }
  });
