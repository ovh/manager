/**
 * @ngdoc overview
 *
 * @name actionsMenu
 *
 *  @requires [pascalprecht.translate](https://github.com/angular-translate/angular-translate)
 *  @requires [ng-ovh-responsive-popover](https://github.com/ovh/manager/tree/master/packages/components/ng-ovh-responsive-popover)
 *
 * @description
 * _An actions menu gives the opportunity to group a set of actions available for a specific
 * context under a single menu._
 *
 *  ## TODO
 *
 *  - customizing page width ;
 *  - customizing open animation ;
 *  - actions with confirmation.
 */

import angular from 'angular';

import '@ovh-ux/ng-ovh-responsive-popover';
import 'angular-translate';

import ngOvhActionsMenuItem from './item';

import directive from './directive';
import factory from './factory';
import provider from './provider';

import innerTemplate from './template-inner.html';

import './index.less';

const moduleName = 'ngOvhActionsMenu';

angular
  .module(moduleName, [
    ngOvhActionsMenuItem,
    'ngOvhResponsivePopover',
    'pascalprecht.translate',
  ])
  .directive('actionsMenu', directive)
  .factory('ActionsMenu', factory)
  .provider('actionsMenu', provider)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'ng-ovh-actions-menu/template-inner.html',
        innerTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
