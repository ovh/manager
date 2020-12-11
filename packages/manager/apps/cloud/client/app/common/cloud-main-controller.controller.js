import { Environment } from '@ovh-ux/manager-config';

class CloudMainController {
  constructor(
    $document,
    $interval,
    $scope,
    $rootScope,
    $transitions,
    $translate,
    CucProductsService,
  ) {
    this.$document = $document;
    this.$interval = $interval;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$transitions = $transitions;
    this.$translate = $translate;
    this.CucProductsService = CucProductsService;
    this.chatbotEnabled = false;
  }

  $onInit() {
    this.expiringProject = null;

    this.navbarOptions = {
      toggle: {
        event: 'sidebar:loaded',
      },
      universe: Environment.getUniverse(),
    };

    this.currentLanguage = Environment.getUserLanguage();
    this.user = Environment.getUser();
    const unregisterListener = this.$scope.$on('app:started', () => {
      this.chatbotEnabled = true;
      unregisterListener();
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
