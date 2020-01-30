import angular from 'angular';
import 'font-awesome/css/font-awesome.css';

import paymentInfoComponent from './payment-info';
import create from './create';
import enterpriseCloudDatabaseComponent from './enterprise-cloud-database.component';
import enterpriseCloudDatabaseService from './enterprise-cloud-database.service';
import priceComponent from './price';
import routing from './enterprise-cloud-database.routing';
import service from './service';

const moduleName = 'enterpriseCloudDatabase';

angular
  .module(moduleName, [paymentInfoComponent, create, priceComponent, service])
  .config(routing)
  .component(
    'enterpriseCloudDatabaseComponent',
    enterpriseCloudDatabaseComponent,
  )
  .service('enterpriseCloudDatabaseService', enterpriseCloudDatabaseService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
