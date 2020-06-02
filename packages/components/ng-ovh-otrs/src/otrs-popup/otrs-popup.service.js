/* eslint no-underscore-dangle: 0 */
import angular from 'angular';
import $ from 'jquery';

export default class OtrsPopupService {
  constructor($rootScope) {
    'ngInject';

    this.$rootScope = $rootScope;

    this.loaded = false;
    this.opened = false;

    const actions = [
      'minimize',
      'maximize',
      'restore',
      'close',
      'open',
    ];
    angular.forEach(actions, (action) => {
      this[action] = id => this.$rootScope.$broadcast(`otrs.popup.${action}`, id);
    });
  }

  init() {
    this.open();
    this.loaded = true;
    this.opened = true;
    this.$rootScope.$broadcast('otrs.popup.opened');
  }

  isLoaded() {
    return this.loaded;
  }

  isOpen() {
    return this.opened;
  }

  toggle() {
    if ($('[data-otrs-popup]').hasClass('close')) {
      this.open();
      this.opened = true;
      this.$rootScope.$broadcast('otrs.popup.opened');
    } else {
      this.close();
      this.opened = false;
      this.$rootScope.$broadcast('otrs.popup.closed');
    }
  }
}
