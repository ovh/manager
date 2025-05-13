import angular from 'angular';

import datacenterMailingListSubscribeComponent from '../../../../components/dedicated-cloud/mailing-list/subscribe';
import routing from './dedicatedCloud-mailing-list-subscribe.routes';

const moduleName = 'dedicatedCloudMailingListSubscribe';

angular
  .module(moduleName, [datacenterMailingListSubscribeComponent])
  .config(routing);

export default moduleName;
