/* eslint no-underscore-dangle: 0 */
import angular from 'angular';
import $ from 'jquery';

export default class OtrsPopupService {
  constructor($rootScope) {
    'ngInject';

    this.$rootScope = $rootScope;

    this.isLoaded = false;
    this.isOpen = false;

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
    this.isLoaded = true;
    this.isOpen = true;
    this.$rootScope.$broadcast('otrs.popup.opened');
  }

  isLoaded() {
    return this.isLoaded;
  }

  isOpen() {
    return this.isOpen;
  }

  toggle() {
    if ($('[data-otrs-popup] .draggable').hasClass('close')) {
      this.open();
      this.isOpen = true;
      this.$rootScope.$broadcast('otrs.popup.opened');
    } else {
      this.close();
      this.isOpen = false;
      this.$rootScope.$broadcast('otrs.popup.closed');
    }
  }
}
