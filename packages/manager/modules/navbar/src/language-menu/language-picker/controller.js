export default class {
  /* @ngInject */
  constructor($scope, atInternet) {
    this.$scope = $scope;
    this.atInternet = atInternet;
  }

  changeLang(lang) {
    this.currentLanguage = lang;
    this.atInternet.trackClick({
      type: 'action',
      name: 'navbar::action::lang::change-lange',
    });
    return this.$scope.$emit('lang.onChange', { lang: lang.key });
  }
}
