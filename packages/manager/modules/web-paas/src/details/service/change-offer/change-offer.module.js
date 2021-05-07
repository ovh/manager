import angular from 'angular';
import 'angular-translate';
import routing from './change-offer.routing';
import component from './change-offer.component';
import offerComponent from '../../../components/offers';
import summaryComponent from '../../../components/summary';
import userList from '../../../components/user-list';

const moduleName = 'ovhManagerWebPaasChangeOffer';

angular
  .module(moduleName, [offerComponent, summaryComponent, userList])
  .config(routing)
  .component('webPaasChangeOfferComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
