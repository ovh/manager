import component from './private-database-order-clouddb.component';
import routing from './private-database-order-clouddb.routing';
import service from './private-database-order-clouddb.service';
import dbCategoriesOffers from '../../../hosting/database/order/public/components/steps/db-categories-offers';

const moduleName = 'ovhManagerWebPrivateDatabaseOrderClouddb';

angular
  .module(moduleName, [dbCategoriesOffers])
  .component(component.name, component)
  .service('PrivateDatabaseOrderCloudDb', service)
  .config(routing);

export default moduleName;
