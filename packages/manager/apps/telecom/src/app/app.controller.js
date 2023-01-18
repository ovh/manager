import { isTopLevelApplication } from '@ovh-ux/manager-config';
import { getShellClient } from './shell';
import {
  SYSTRAN_LOCALE_UNAVAILABLE,
  URL_SURVEY_SYSTRAN,
} from './app.constants';

export default class TelecomAppCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $timeout,
    $transitions,
    betaPreferenceService,
    coreConfig,
  ) {
    this.displayFallbackMenu = false;
    $transitions.onStart({}, () => this.closeSidebar());

    this.$scope = $scope;
    this.$timeout = $timeout;
    this.betaPreferenceService = betaPreferenceService;
    this.coreConfig = coreConfig;
    this.isTopLevelApplication = isTopLevelApplication();

    this.shell = getShellClient();

    this.URL_SURVEY_SYSTRAN = URL_SURVEY_SYSTRAN;

    this.shell.ux.isMenuSidebarVisible().then((isMenuSidebarVisible) => {
      this.isMenuSidebarVisible = isMenuSidebarVisible;
    });
  }

  $onInit() {
    this.currentLanguage = this.coreConfig.getUserLanguage();

    this.displaySystranMessage = !(
      SYSTRAN_LOCALE_UNAVAILABLE === this.currentLanguage
    );

    this.shell.ux.onRequestClientSidebarOpen(() =>
      this.$timeout(() => this.openSidebar()),
    );

    return this.betaPreferenceService.isBetaActive().then((beta) => {
      this.sidebarUniverse = beta ? 'TELECOM_BETA' : 'TELECOM';
    });
  }

  openSidebar() {
    this.displayFallbackMenu = true;
  }

  closeSidebar() {
    this.displayFallbackMenu = false;
  }
}
