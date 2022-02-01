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

    this.rule = {
      destIp: '',
      destPort: '',
      destZone: '',
      family: '',
      name: '',
      priority: '',
      protocol: '',
      srcIp: '',
      srcPort: '',
      srcZone: '',
      target: '',
    };
    this.redirect = {
      destIp: '',
      destPort: '',
      destZone: '',
      name: '',
      priority: '',
      protocol: '',
      srcDestIp: '',
      srcDestPort: '',
      srcIp: '',
      srcPort: '',
      srcZone: '',
      target: '',
    };

    return this.$q.all([this.loadRules(), this.loadRedirect()]);
  }

  loadRules() {
    return this.$http
      .get(`/overTheBox/${this.serviceName}/configuration/firewall/rule`)
      .then((response) => {
        if (response.data) {
          this.rules = response.data;
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

  loadRedirect() {
    return this.$http
      .get(`/overTheBox/${this.serviceName}/configuration/firewall/redirect`)
      .then((response) => {
        if (response.data) {
          this.redirections = response.data;
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

  addRule() {
    this.rule.destIp = '';
    this.rule.destPort = '';
    this.rule.destZone = '';
    this.rule.family = '';
    this.rule.name = '';
    this.rule.priority = '';
    this.rule.protocol = '';
    this.rule.srcIp = '';
    this.rule.srcPort = '';
    this.rule.srcZone = '';
    this.rule.target = '';
    this.showAddRule = true;
    this.displayAddRuleButton = false;
  }

  createRule() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.rule.srcZone && !this.rule.target && !this.rule.priority) {
      return this.$q.resolve(null);
    }

    const params = {
      priority: this.rule.priority,
      configuration: {
        sourceZone: this.rule.srcZone,
        target: this.rule.target,
      },
    };

    if (this.rule.destIp) {
      params.configuration.destinationIp = this.rule.destIp;
    }
    if (this.rule.destPort) {
      params.configuration.destinationPort = this.rule.destPort;
    }
    if (this.rule.destZone) {
      params.configuration.destinationZone = this.rule.destZone;
    }
    if (this.rule.family) {
      params.configuration.family = this.rule.family;
    }
    if (this.rule.name) {
      params.configuration.name = this.rule.name;
    }
    if (this.rule.protocol) {
      params.configuration.protocol = this.rule.protocol;
    }
    if (this.rule.srcIp) {
      params.configuration.sourceIp = this.rule.srcIp;
    }
    if (this.rule.srcPort) {
      params.configuration.sourcePort = this.rule.srcPort;
    }

    return this.$http
      .post(
        `/overTheBox/${this.serviceName}/configuration/firewall/rule`,
        params,
      )
      .then((response) => {
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_firewall_rule_create_succeed',
        );

        // Reload rule table
        this.loadRules();
        this.showAddRule = false;
        this.displayAddRuleButton = true;
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
      .then((response) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_firewall_rule_remove_succeed',
        );

        // Reload rules table
        this.loadRules();
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

  addRedirect() {
    this.redirect.destIp = '';
    this.redirect.destPort = '';
    this.redirect.destZone = '';
    this.redirect.name = '';
    this.redirect.priority = '';
    this.redirect.protocol = '';
    this.redirect.srcDestIp = '';
    this.redirect.srcDestPort = '';
    this.redirect.srcIp = '';
    this.redirect.srcPort = '';
    this.redirect.srcZone = '';
    this.redirect.target = '';
    this.showAddRedirect = true;
    this.displayAddRedirectButton = false;
  }

  createRedirect() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.redirect.name && !this.redirect.priority) {
      return this.$q.resolve(null);
    }

    const params = {
      configuration: {
        name: this.redirect.name,
      },
      priority: this.redirect.priority,
    };

    if (this.redirect.destIp) {
      params.configuration.destinationIp = this.redirect.destIp;
    }
    if (this.redirect.destPort) {
      params.configuration.destinationPort = this.redirect.destPort;
    }
    if (this.redirect.destZone) {
      params.configuration.destinationZone = this.redirect.destZone;
    }
    if (this.redirect.protocol) {
      params.configuration.protocol = this.redirect.protocol;
    }
    if (this.redirect.srcDestIp) {
      params.configuration.sourceDestinationIp = this.redirect.srcDestIp;
    }
    if (this.redirect.srcDestPort) {
      params.configuration.sourceDestinationPort = this.redirect.srcDestPort;
    }
    if (this.redirect.srcIp) {
      params.configuration.sourceIp = this.redirect.srcIp;
    }
    if (this.redirect.srcPort) {
      params.configuration.sourcePort = this.redirect.srcPort;
    }
    if (this.redirect.srcZone) {
      params.configuration.sourceZone = this.redirect.srcZone;
    }
    if (this.redirect.target) {
      params.configuration.target = this.redirect.target;
    }

    return this.$http
      .post(
        `/overTheBox/${this.serviceName}/configuration/firewall/redirect`,
        params,
      )
      .then((response) => {
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_firewall_redirect_create_succeed',
        );

        // Reload redirections table
        this.loadRedirect();
        this.showAddRedirect = false;
        this.displayAddRedirectButton = true;
        return response;
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
      .then((response) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfigure_firewall_redirect_remove_succeed',
        );

        // Reload redirections table
        this.loadRedirect();
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
