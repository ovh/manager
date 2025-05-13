import angular from 'angular';

import datacenterMailingListSubscribeComponent from '../../../../components/dedicated-cloud/mailing-list/subscribe';
import routing from './mailing-list-subscribe.routes';

const moduleName = 'managedBaremetalMailingListSubscribe';

angular
  .module(moduleName, [datacenterMailingListSubscribeComponent])
  .config(routing);

export default moduleName;
