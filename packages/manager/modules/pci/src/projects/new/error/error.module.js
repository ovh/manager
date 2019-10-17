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
  .run(/* @ngInject */ ($transitions) => {
    $transitions.onError({
      to: 'pci.projects.new.**',
    }, (transition) => {
      const error = transition.error();
      return ({
        state: 'pci.projects.new.error',
        params: {
          detail: {
            message: get(error.detail, 'data.message'),
            code: has(error.detail, 'headers') ? error.detail.headers('x-ovh-queryId') : null,
          },
        },
        location: false,
      });
    });
  });

export default moduleName;
