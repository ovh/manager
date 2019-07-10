angular.module('App').controller(
  'EmailsHelpCtrl',
  class EmailsHelpCtrl {
    /**
     * Constructor
     * @param $scope
     * @param ovhUserPref
     */
    constructor($scope, ovhUserPref) {
      this.$scope = $scope;
      this.ovhUserPref = ovhUserPref;
    }

    $onInit() {
      this.emails = _.get(this.$scope.currentActionData, 'emails', []);
      this.hideEmailsHelp = {};
      this.loading = false;
      this.productId = _.get(this.$scope.currentActionData, 'productId');
      this.quotas = _.get(this.$scope.currentActionData, 'quotas', {
        account: 0,
        mailingList: 0,
        redirection: 0,
        responder: 0,
      });
      this.responders = [];
      this.summary = _.get(this.$scope.currentActionData, 'summary', {
        account: 0,
        redirection: 0,
        responder: 0,
      });

      this.canCreate = {
        account:
          this.quotas.account > 0
          && this.summary.account - 1 < this.quotas.account,
        mailingList: this.quotas.mailingList > 0,
        redirection:
          this.summary.redirection
          < this.quotas.redirection + this.quotas.alias,
        responder:
          this.quotas.account > 0
          && this.summary.responder < this.quotas.responder,
      };

      this.$scope.configureHelp = () => this.configureHelp();
    }

    configureHelp() {
      if (!this.hideEmailsHelp.one && !this.hideEmailsHelp.all) {
        return this.$scope.resetAction();
      }
      this.loading = true;

      const pref = {};
      pref[this.productId] = { hideEmailsHelp: !!this.hideEmailsHelp.one };
      pref.hideEmailsHelp = !!this.hideEmailsHelp.all;

      return this.ovhUserPref.assign('WEB_EMAILS', pref).finally(() => {
        this.loading = false;
        this.$scope.resetAction();
      });
    }
  },
);
