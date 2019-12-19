import angular from 'angular';
import assign from 'lodash/assign';
import filter from 'lodash/filter';
import pick from 'lodash/pick';
import union from 'lodash/union';

export default class SharepointUpdateAccountCtrl {
  /* @ngInject */
  constructor($scope, $q, $stateParams, $translate, Alerter, MicrosoftSharepointLicenseService) {
    this.$scope = $scope;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.sharepointService = MicrosoftSharepointLicenseService;
  }

  $onInit() {
    this.exchangeId = this.$stateParams.exchangeId;

    this.originalValue = angular.copy(this.$scope.currentActionData);

    this.account = this.$scope.currentActionData;
    this.account.login = this.account.userPrincipalName.split('@')[0]; // eslint-disable-line
    this.account.domain = this.account.userPrincipalName.split('@')[1]; // eslint-disable-line

    this.availableDomains = [];
    this.availableDomains.push(this.account.domain);

    this.$scope.updateMsAccount = () => this.updateMsAccount();

    this.getMsService();
    this.getAccountDetails();
    this.getSharepointUpnSuffixes();
  }

  getMsService() {
    this.sharepointService.retrievingMSService(this.exchangeId)
      .then((exchange) => { this.$scope.exchange = exchange; });
  }

  getAccountDetails() {
    this.sharepointService.getAccountDetails(this.exchangeId, this.account.userPrincipalName)
      .then((accountDetails) => assign(this.account, accountDetails));
  }

  getSharepointUpnSuffixes() {
    this.sharepointService
      .getSharepointUpnSuffixes(this.exchangeId)
      .then((upnSuffixes) => this.$q.all(
        filter(upnSuffixes, (suffix) => this.sharepointService
          .getSharepointUpnSuffixeDetails(this.exchangeId, suffix)
          .then((suffixDetails) => suffixDetails.ownershipValidated)),
      ))
      .then((availableDomains) => {
        this.availableDomains = union([this.account.domain], availableDomains);
      });
  }

  updateMsAccount() {
    this.account.userPrincipalName = `${this.account.login}@${this.account.domain}`;
    return this.sharepointService.updateSharepoint(this.exchangeId, this.originalValue.userPrincipalName, pick(this.account, ['userPrincipalName', 'firstName', 'lastName', 'initials', 'displayName']))
      .then(() => {
        this.alerter.success(this.$translate.instant('sharepoint_account_update_configuration_confirm_message_text', { t0: this.account.userPrincipalName }), this.$scope.alerts.main);
      })
      .catch((err) => {
        this.alerter.alertFromSWS(this.$translate.instant('sharepoint_account_update_configuration_error_message_text'), err, this.$scope.alerts.main);
      })
      .finally(() => {
        this.$scope.resetAction();
      });
  }
}
