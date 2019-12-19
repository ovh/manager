import angular from 'angular';
import Konami from 'konami-code-js';

import {
  DARK_MODE_LOCAL_STORAGE_KEY,
  DARK_MODE_LOCAL_STORAGE_KEY_ACTIVATE,
  DARK_MODE_LOCAL_STORAGE_KEY_DEACTIVATE,
  DARK_MODE_THEME_NAME,
  DARK_MODE_TRACKING_KEY,
} from './dark-mode.constants';

import controller from './modal/controller';
import template from './modal/template.html';

export default class DarkModeController {
  /* @ngInject */
  constructor($document, $timeout, $uibModal, atInternet) {
    this.$document = $document;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.rootElement = this.$document[0].querySelector('html');

    if (DarkModeController.isDarkThemeActive()) {
      this.injectDarkTheme();
    }

    this.konami = new Konami(() => this.toggle());
  }

  /**
   * Check if the dark theme is activate by looking into the localStorage value.
   * @return {Boolean}
   */
  static isDarkThemeActive() {
    return localStorage
      .getItem(DARK_MODE_LOCAL_STORAGE_KEY) === DARK_MODE_LOCAL_STORAGE_KEY_ACTIVATE;
  }

  /**
   * Activate the dark theme and send a tracking information.
   * @return {void}
   */
  activateDarkTheme() {
    localStorage.setItem(
      DARK_MODE_LOCAL_STORAGE_KEY,
      DARK_MODE_LOCAL_STORAGE_KEY_ACTIVATE,
    );

    this.atInternet.trackClick({
      name: DARK_MODE_TRACKING_KEY,
      type: 'action',
    });

    this.injectDarkTheme();
  }

  /**
   * Deactivate the dark theme.
   * @return {void}
   */
  deactiveDarkTheme() {
    localStorage.setItem(
      DARK_MODE_LOCAL_STORAGE_KEY,
      DARK_MODE_LOCAL_STORAGE_KEY_DEACTIVATE,
    );

    this.rootElement.classList.remove(DARK_MODE_THEME_NAME);
  }

  /**
   * Import dynamically dark theme
   */

  injectDarkTheme() {
    return import('../../assets/theme/dark/index.less')
      .then(() => this.rootElement.classList.add(DARK_MODE_THEME_NAME));
  }

  /**
   * Display a modal to inform the user that he is about to move to
   * the dark side of the moon.
   * @return {Promise}
   */
  openModal() {
    return this.$uibModal
      .open({
        template,
        controller,
        controllerAs: '$ctrl',
      })
      .result
      .then((shouldActiveDarkTheme) => (shouldActiveDarkTheme
        ? this.activateDarkTheme()
        : angular.noop))
      .catch(angular.noop); // Prevent unhandled rejection.
  }

  toggle() {
    if (DarkModeController.isDarkThemeActive()) {
      return this.deactiveDarkTheme();
    }
    return this.openModal();
  }
}
