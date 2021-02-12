<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>export default class <%= pascalcasedName %>Ctrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    console.log('Hello', this.$translate.instant('world'));
  }
}
