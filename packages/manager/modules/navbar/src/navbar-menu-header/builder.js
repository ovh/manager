import merge from 'lodash/merge';

import template from './template.html';

export default class NavbarBuilder {
  /* @ngInject */
  constructor($compile, $rootScope, $timeout) {
    this.$compile = $compile;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
  }

  buildMenuHeader(content) {
    const compiledTemplate = this.$compile(template)(
      merge(this.$rootScope.$new(true), { $ctrl: { content } }),
    );
    // $timeout is required in order to let angular's scope $digest
    return this.$timeout(() => compiledTemplate.html());
  }
}
