export default class EmailDomainCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $timeout,
    $translate,
    Alerter,
    currentActiveLink,
    emailLink,
    informationLink,
    mailingListLink,
    taskLink,
    WucEmails,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.currentActiveLink = currentActiveLink;
    this.emailLink = emailLink;
    this.informationLink = informationLink;
    this.mailingListLink = mailingListLink;
    this.taskLink = taskLink;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.loading = {
      init: true,
      domainsInfos: false,
    };
    this.stepPath = '';

    this.$scope.alerts = {
      page: 'domain_alert_page',
      main: 'domain_alert_main',
    };
    this.$scope.currentAction = null;
    this.$scope.currentActionData = null;
    this.$scope.domain = {};
    this.$scope.itemsPerPage = 10;

    this.$scope.resetAction = () => this.$scope.setAction(false);

    this.$scope.setAction = (action, data) => {
      this.$scope.currentAction = action;
      this.$scope.currentActionData = data;

      if (action) {
        this.stepPath = `${this.$scope.currentAction}.html`;
        $('#currentAction').modal({
          keyboard: true,
          backdrop: 'static',
        });
      } else {
        $('#currentAction').modal('hide');
        this.$scope.currentActionData = null;
        this.$timeout(() => {
          this.stepPath = '';
        }, 300);
      }
    };

    this.loadDomain();
  }

  loadDomain() {
    this.loading.domainsInfos = true;
    return this.WucEmails.getDomain(this.$stateParams.productId)
      .then((domain) => {
        this.$scope.domain = domain;
        this.$scope.domain.displayName = domain.domain;
        if (domain.offer && domain.offer.indexOf('hosting') === -1) {
          this.emailsCanTerminate = true;
        }
      })
      .catch(() => {
        this.Alerter.error(
          this.$translate.instant('domain_dashboard_loading_error'),
        );
      })
      .finally(() => {
        this.loading.init = false;
        this.loading.domainsInfos = false;
      });
  }
}
