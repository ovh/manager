import angular from 'angular';

import ducBandwidth from './bandwidth';
import ducBytes from './bytes';
import ducContract from './contract';
import ducNotification from './notification';
import ducPrice from './price';
import ducTabs from './tabs';
import ducTranslate from './translate';

import ducCheckboxSwitch from './directives/checkboxSwitch';
import ducSshKeySwitch from './directives/sshkeySwitch';

import config from './config';
import components from './components';

import sshkeyMinFilter from './filters/sshkeyMin';

import validatorService from './validator/validator.service';

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
    components,
    ducCheckboxSwitch,
    ducSshKeySwitch,
  ])
  .constant('constants', {
    // prodMode: config.prodMode,
    swsProxyRootPath: config.swsProxyRootPath,
    aapiRootPath: config.aapiRootPath,
    target: config.target,
    renew: config.constants.RENEW_URL,
    urls: config.constants.URLS,
    UNIVERS: config.constants.UNIVERS,
    TOP_GUIDES: config.constants.TOP_GUIDES,
    vmsUrl: config.constants.vmsUrl,
    travauxUrl: config.constants.travauxUrl,
    aapiHeaderName: 'X-Ovh-Session',
    vrackUrl: config.constants.vrackUrl,
    REDIRECT_URLS: config.constants.REDIRECT_URLS,
    DEFAULT_LANGUAGE: config.constants.DEFAULT_LANGUAGE,
    FALLBACK_LANGUAGE: config.constants.FALLBACK_LANGUAGE,
    SUPPORT: config.constants.SUPPORT,
    billingRenew: config.constants.billingRenew,
  })
  .constant('website_url', config.constants.website_url)
  .constant('BILLING_BASE_URL', 'billing/')
  .constant('Billing.constants', {
    aapiRootPath: config.aapiRootPath,
    swsProxyRootPath: config.swsProxyRootPath,
    paymentMeans: [
      'bankAccount',
      'paypal',
      'creditCard',
      'deferredPaymentAccount',
    ],
    target: config.target,
  })
  // .constant('LANGUAGES', constants.LANGUAGES)
  .constant('Billing.URLS', {
    renew: config.constants.billingRenew,
  })
  .constant('UserAccount.constants', {
    aapiRootPath: config.aapiRootPath,
    swsProxyRootPath: config.swsProxyRootPath,
    target: config.target,
  })
  .constant('CountryConstants', {
    support: config.constants.URLS.support,
  })
  .constant('AccountCreationURLS', config.constants.accountCreation)
  .constant('sshkey-regex', [
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
  .filter('sshkeyMin', sshkeyMinFilter)
  .service('Validator', validatorService);

export default moduleName;
