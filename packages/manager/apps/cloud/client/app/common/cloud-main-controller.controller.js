class CloudMainController {
  constructor(
    $document,
    $interval,
    $rootScope,
    $transitions,
    $translate,
    CucProductsService,
    SessionService,
  ) {
    this.$document = $document;
    this.$interval = $interval;
    this.$rootScope = $rootScope;
    this.$transitions = $transitions;
    this.$translate = $translate;
    this.CucProductsService = CucProductsService;
    this.SessionService = SessionService;
  }

  $onInit() {
    this.expiringProject = null;

    [this.currentLanguage] = this.$translate.use().split('_');

    this.SessionService.getUser().then((user) => {
      this.user = user;
    });

    this.$transitions.onStart({}, () => this.closeSidebar());
  }

  openSidebar() {
    this.sidebarIsOpen = true;
  }

  closeSidebar() {
    this.sidebarIsOpen = false;
  }

  updateRemainingTime() {
    const expirationMoment = moment(this.expiringProject.expiration);
    if (
      expirationMoment.isBefore(moment().utc()) &&
      angular.isDefined(this.expiringProjectInterval)
    ) {
      this.$interval.cancel(this.expiringProjectInterval);
    }
    this.remainingTime = this.getRemainingTime(this.expiringProject.expiration);
  }

  getRemainingTime(expiration) {
    const expirationMoment = moment(expiration);
    const ms = Math.max(0, moment(expirationMoment).diff(moment().utc()));
    const duration = moment.duration(ms);
    this.expirationDays = duration.days();
    this.expirationHours = duration.hours();
    this.expirationMinutes = duration.minutes();
  }

  scrollTo(id) {
    // Set focus to target
    this.$document.find(`#${id}`)[0].focus();
  }
}

angular
  .module('managerApp')
  .controller('CloudMainController', CloudMainController);
