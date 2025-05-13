import angular from 'angular';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import Apiv2Service from '../apiv2.service';
import paramTypes from './apiv2-cursors-type';
import component from './apiv2-list-layout.component';
import utils from './apiv2-list-layout.utils';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

const moduleName = 'ovhManagerApiV2ListLayout';

/**
 * Register each param type onto the $urlMatcherFactoryProvider
 * @see https://ui-router.github.io/ng1/docs/latest/interfaces/params.paramdeclaration.html#type
 * @see https://ui-router.github.io/ng1/docs/latest/interfaces/params.paramtypedefinition.html
 * @param {UrlMatcherFactoryProvider} $urlMatcherFactoryProvider
 */
const registerTypes = /* @ngInject */ ($urlMatcherFactoryProvider) =>
  Object.values(paramTypes).forEach(({ type, ...definition }) =>
    $urlMatcherFactoryProvider.type(type, definition),
  );

angular
  .module(moduleName, ['oui', angularTranslate, ngOvhUtils])
  .config(registerTypes)
  .service('Apiv2Service', Apiv2Service)
  .component('apiV2ListLayout', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default {
  ...utils,
  moduleName,
};
