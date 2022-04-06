export default class OverTheBoxAutoconfigureFirewall {
  /* @ngInject */
  constructor($http, $q, $translate, OVERTHEBOX_FIREWALL) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.OVERTHEBOX_FIREWALL = OVERTHEBOX_FIREWALL;
  }

  $onInit() {
    this.displayAddRuleButton = true;
    this.showAddRule = false;
    this.displayAddRedirectButton = true;
    this.showAddRedirect = false;

    this.rule = {};
    this.redirect = {};

    return this.$q.all([this.loadRules(), this.loadRedirect()]);
  }

  loadRules() {
    return this.$http
      .get(`/overTheBox/${this.serviceName}/configuration/firewall/rule`)
      .then((response) => {
        this.rules = response.data;
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

  loadRedirect() {
    return this.$http
      .get(`/overTheBox/${this.serviceName}/configuration/firewall/redirect`)
      .then((response) => {
        this.redirections = response.data;
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

  addRule() {
    this.rule = {};
    this.showAddRule = true;
    this.displayAddRuleButton = false;
  }

  createRule() {
    this.errorMessage = '';
    this.successMessage = '';

    const params = {
      priority: this.rule.priority,
      configuration: {
        sourceZone: this.rule.srcZone,
        target: this.rule.target,
        destinationIp: this.rule.destIp,
        destinationPort: this.rule.destPort,
        destinationZone: this.rule.destZone,
        family: this.rule.family,
        name: this.rule.name,
        protocol: this.rule.protocol,
        sourceIp: this.rule.srcIp,
        sourcePort: this.rule.srcPort,
      },
    };

    return this.$http
      .post(
        `/overTheBox/${this.serviceName}/configuration/firewall/rule`,
        params,
      )
      .then(() => {
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_firewall_rule_create_succeed',
        );

        // Reload rule table
        this.showAddRule = false;
        this.displayAddRuleButton = true;
        return this.loadRules();
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

  cancelCreateRule() {
    this.showAddRule = false;
    this.displayAddRuleButton = true;
  }

  removeRule(row) {
    this.errorMessage = '';
    this.successMessage = '';

    return this.$http
      .delete(
        `/overTheBox/${this.serviceName}/configuration/firewall/rule/${row.id}`,
      )
      .then(() => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_firewall_rule_remove_succeed',
        );

        // Reload rules table
        return this.loadRules();
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

  addRedirect() {
    this.redirect = {};
    this.showAddRedirect = true;
    this.displayAddRedirectButton = false;
  }

  createRedirect() {
    this.errorMessage = '';
    this.successMessage = '';

    const params = {
      configuration: {
        name: this.redirect.name,
        destinationIp: this.redirect.destIp,
        destinationPort: this.redirect.destPort,
        destinationZone: this.redirect.destZone,
        protocol: this.redirect.protocol,
        sourceDestinationIp: this.redirect.srcDestIp,
        sourceDestinationPort: this.redirect.srcDestPort,
        sourceIp: this.redirect.srcIp,
        sourcePort: this.redirect.srcPort,
        sourceZone: this.redirect.srcZone,
        target: this.redirect.target,
      },
      priority: this.redirect.priority,
    };

    return this.$http
      .post(
        `/overTheBox/${this.serviceName}/configuration/firewall/redirect`,
        params,
      )
      .then(() => {
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_firewall_redirect_create_succeed',
        );

        // Reload redirections table
        this.showAddRedirect = false;
        this.displayAddRedirectButton = true;
        return this.loadRedirect();
      })
      .catch((error) => {
        const errorMessage = error.data.class
          ? `${error.data.message} - ${error.data.class}`
          : error.data.message;
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfigure_create_failed',
          {
            errorMessage,
          },
        );
      });
  }

  cancelCreateRedirect() {
    this.showAddRedirect = false;
    this.displayAddRedirectButton = true;
  }

  removeRedirect(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.$http
      .delete(
        `/overTheBox/${this.serviceName}/configuration/firewall/redirect/${row.id}`,
      )
      .then(() => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_firewall_redirect_remove_succeed',
        );

        // Reload redirections table
        return this.loadRedirect();
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
