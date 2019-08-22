import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import '@ovh-ux/manager-error-page';

import get from 'lodash/get';
import has from 'lodash/has';

import routing from './error.routing';

import './error.scss';

const moduleName = 'ovhManagerPciProjectsNewError';

angular
  .module(moduleName, [
    'oui',
    'ui.router',
    'ngTranslateAsyncLoader',
    'ovhManagerErrorPage',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngInject */ ($state, $transition$) => $transition$.onError({
    to: 'pci.projects.new.**',
  }, (transition) => {
    const error = transition.error();
    $state.go('pci.projects.new.error', {
      detail: {
        message: get(error.detail, 'data.message'),
        code: has(error.detail, 'headers') ? error.detail.headers('x-ovh-queryId') : null,
      },
    }, { location: false });
  }));

export default moduleName;
