import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import 'font-awesome/css/font-awesome.css';

import '@ovh-ux/manager-filters';
import '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ng-ovh-cloud-universe-components';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-manager-webfont/dist/css/ovh-font.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

import '@ovh-ux/ng-ui-router-breadcrumb';

import paymentInfoComponent from './payment-info';
import create from './create';
import enterpriseCloudDatabaseComponent from './enterprise-cloud-database.component';
import enterpriseCloudDatabaseService from './enterprise-cloud-database.service';
import priceComponent from './price';
import routing from './enterprise-cloud-database.routing';
import service from './service';

import './index.scss';

const moduleName = 'enterpriseCloudDatabase';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngUiRouterBreadcrumb',
    'ngUiRouterLayout',
    'ngOvhPaymentMethod',
    'ngOvhCloudUniverseComponents',
    'ovhManagerFilters',
    paymentInfoComponent,
    create,
    priceComponent,
    service,
  ])
  .config(routing)
  .component(
    'enterpriseCloudDatabaseComponent',
    enterpriseCloudDatabaseComponent,
  )
  .service('enterpriseCloudDatabaseService', enterpriseCloudDatabaseService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
