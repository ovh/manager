import angular from 'angular';

import ducBandwidth from './bandwidth';
import ducBytes from './bytes';
import ducContract from './contract';
import ducNotification from './notification';
import ducPrice from './price';
import ducTabs from './tabs';
import ducTranslate from './translate';

import ducSshKeySwitch from './directives/sshkeySwitch';

import config from './config';
import noDefaultMeansOfPayment from './no-default-means-of-payment';
import sshkeyMinFilter from './filters/sshkeyMin';
import validatorService from './validator.service';
import userService from './user.service';

const moduleName = 'ngOvhDedicatedUniverseComponents';

angular
  .module(moduleName, [
    ducBandwidth,
    ducBytes,
    ducContract,
    ducNotification,
    ducPrice,
    ducTabs,
    ducTranslate,
    ducSshKeySwitch,
    noDefaultMeansOfPayment,
  ])
  .constant('ducConstants', {
    swsProxyRootPath: config.swsProxyRootPath,
    urls: config.ducConstants.URLS,
    target: config.target,
  })
  .constant('ducPaymentMeans', {
    paymentMeans: [
      'bankAccount',
      'paypal',
      'creditCard',
      'deferredPaymentAccount',
    ],
  })
  .constant('ducSshkeyRegex', [
    {
      name: 'RSA',
      regex: /^(ssh-rsa)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+(\S+)$/,
    },
    {
      name: 'ECDSA',
      regex: /^(ecdsa-sha2-nistp[0-9]+)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+(\S+)$/,
    },
    {
      name: 'ED25519',
      regex: /^(ssh-ed25519)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+(\S+)$/,
    },
  ])
  .filter('ducSshkeyMin', sshkeyMinFilter)
  .service('ducUserValidator', validatorService)
  .service('ducUser', userService);

export default moduleName;
