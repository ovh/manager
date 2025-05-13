import angular from 'angular';

import form from './form';
import documents from './documents';
import summary from './summary';

const moduleName = 'TelephonySvaWalletKycIdentity';

angular
  .module(moduleName, [form, documents, summary])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
