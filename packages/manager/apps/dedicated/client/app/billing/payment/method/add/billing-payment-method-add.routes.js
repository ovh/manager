import template from './billing-payment-method-add.html';
import controller from './billing-payment-method-add.controller';

// views templates
import legacyBankAccountTemplate from './views/legacy-bank-account/add-legacy-bank-account.html';
import legacyBankAccountViewCtrl from './views/legacy-bank-account/add-legacy-bank-account.controller';

import legacyBillingAddressTemplate from './views/legacy-billing-address/add-legacy-billing-address.html';
import legacyBillingAddressViewCtrl from './views/legacy-billing-address/add-legacy-billing-address.controller';

import billingContactTemplate from './views/billing-address/add-billing-address.html';
import billingAddressViewCtrl from './views/billing-address/add-billing-address.controller';

angular
  .module('Billing')
  .config(($stateProvider, $urlRouterProvider) => {
    const name = 'app.account.billing.payment.method.add';

    $stateProvider.state(name, {
      url: '/add?status&from',
      translations: {
        value: [
          './',
          './views/billing-address',
        ],
        format: 'json',
      },
      views: {
        '': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
        'legacyBankAccount@app.account.billing.payment.method.add': {
          template: legacyBankAccountTemplate,
          controller: legacyBankAccountViewCtrl,
          controllerAs: '$ctrl',
        },
        'legacyBankAccountOwner@app.account.billing.payment.method.add': {
          template: legacyBillingAddressTemplate,
          controller: legacyBillingAddressViewCtrl,
          controllerAs: '$ctrl',
        },
        'billingAddress@app.account.billing.payment.method.add': {
          template: billingContactTemplate,
          controller: billingAddressViewCtrl,
          controllerAs: '$ctrl',
        },
      },
    });

    $urlRouterProvider.when(
      /^\/billing\/mean\/add$/,
      ($location, $state) => $state.go(name),
    );
  });
