import angular from 'angular';
import 'angular-route';
import 'angular-ui-bootstrap';
import 'bootstrap';
import 'ckeditor';
import 'ng-ckeditor';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ng-ui-router-layout';

import cacheTemplate from './emailpro.template';
import controllers from './emailproControllers.module';
import routing from './emailpro.routes';
import services from './emailproServices.module';
import upgrade from '../upgrade';

import account from '../account/account.module';
import disclaimer from '../disclaimer/disclaimer.module';
import domain from '../domain/domain.module';
import externalContact from '../external-contact/external-contact.module';
import information from '../information/information.module';
import mailingList from '../mailing-list/mailing-list.module';
import redirection from '../redirection/redirection.module';
import task from '../task/task.module';

import '../css/exchangeDiagnostic.css';

import {
  EMAILPRO_MX_CONFIG,
  EMAILPRO_CONFIG_URL,
  EMAILPRO_CONFIG,
} from './emailpro.constants';

const moduleName = 'Module.emailpro';

angular
  .module(moduleName, [
    'ngOvhUtils',
    'ngRoute',
    'ui.bootstrap',
    'ngSanitize',
    'ngOvhWebUniverseComponents',
    'ng.ckeditor',
    'ngUiRouterLayout',
    controllers,
    services,
    upgrade,
    account,
    disclaimer,
    domain,
    externalContact,
    information,
    mailingList,
    redirection,
    task,
  ])
  .constant('EMAILPRO_MX_CONFIG', EMAILPRO_MX_CONFIG)
  .constant('EMAILPRO_CONFIG_URL', EMAILPRO_CONFIG_URL)
  .constant('EMAILPRO_CONFIG', EMAILPRO_CONFIG)
  .config(routing)
  .provider(
    'EMAIL_CAPABILITIES',
    /* @ngInject */ (coreConfigProvider) => ({
      $get: () => ({
        isEmailProAvailable: coreConfigProvider.isRegion('EU'),
      }),
    }),
  )
  .run(cacheTemplate)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
